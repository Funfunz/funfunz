import { isNull, getPKs } from './index.js'
import { IEntityInfo, IRelationMN, IRelation } from '../../generator/configurationTypes.js'
import { Funfunz } from '../index.js'
import { SchemaObjectMap } from '../graphql/manager.js'

const oneToManyRelation = (entity: IEntityInfo, parentEntity: IEntityInfo): IRelation | undefined => {
  return parentEntity.relations?.find(
    (relation) => {
      return relation.type === '1:n' && relation.remoteEntity === entity.name
    }
  )
}

const manyToOneRelation = (entity: IEntityInfo, parentEntity: IEntityInfo): IRelation | undefined => {
  return parentEntity.relations?.find(
    (relation) => {
      return relation.type === 'n:1' && relation.remoteEntity === entity.name
    }
  )
}

const manyToManyRelation = (entity: IEntityInfo, parentEntity: IEntityInfo): IRelation | undefined => {
  return parentEntity.relations?.find(
    (relation) => {
      return relation.type === 'm:n' && relation.remoteEntity === entity.name
    }
  )
}

export type ParentFilterResult = {
  filter: Record<
    string, {
      _eq?: FilterValues,
      _in?: FilterValues
    }
  >,
  relation: string
}

export async function getParentEntryFilter(
  entity: IEntityInfo,
  parentEntity: IEntityInfo,
  parentObj: Record<string, FilterValues>,
  schemas: SchemaObjectMap
): Promise<ParentFilterResult | undefined> {
  let relation: IRelation | undefined = oneToManyRelation(entity, parentEntity)
  if (relation) {
    const pks = getPKs(parentEntity)
    if (pks.length > 1) {
      throw new Error('Multiple pks relation not supported')
    }
    const pk = pks[0]
    const value = parentObj[pk]
    return {
      filter: { [relation.foreignKey]: { _eq: value }},
      relation: '1N'
    }
  }

  relation = manyToOneRelation(entity, parentEntity)
  if (relation) {
    const pks = getPKs(entity)
    if (pks.length > 1) {
      throw new Error('Multiple pks relation not supported')
    }
    const pk = pks[0]
    const value = parentObj[relation.foreignKey]
    return {
      filter: { [pk]: { _eq: value }},
      relation: 'N1'
    }
  }

  // Gets the relation M:N object from the parentEntity
  relation = manyToManyRelation(entity, parentEntity) as IRelationMN
  if (relation) {
    const pks = getPKs(entity)
    if (pks.length > 1) {
      throw new Error('Multiple pks relation not supported')
    }
    const pk = pks[0]
    const remotePks = getPKs(parentEntity)
    if (remotePks.length > 1 && !relation.localPrimaryKey) {
      throw new Error('Multiple pks relation not supported')
    }
    const remotePk = relation.localPrimaryKey || remotePks[0]
    const relationalEntity = relation.relationalEntity
    const remoteForeignKey = relation.remoteForeignKey
    const result = Funfunz.executeGraphQL(schemas.local, `query {
      ${relationalEntity} (
        filter: {
          ${relation.foreignKey}: {
            _eq: ${parentObj[remotePk]}
          }
        }
      ){
        ${relation.foreignKey}
        ${remoteForeignKey}
      }
    }`)

    return result.then(
      (results) => {
        if (results && results.data) {
          const ids = (results.data[relationalEntity] as Record<string, string>[]).map(
            (obj) => {
              return obj[remoteForeignKey]
            }
          ).filter(id => !isNull(id))
  
          return {
            filter: {
              [pk]: {
                _in: ids
              }
            },
            relation: 'MN'
          }
        }
      }
    )
  }
}

export const operators: OperatorsType[] = [
  '_eq',
  '_neq',
  '_lt',
  '_lte',
  '_gt',
  '_gte',
  '_in',
  '_nin',
  '_like',
  '_nlike',
  '_is_null'
]

export type OperatorsType = '_eq'
  | '_neq'
  | '_lt'
  | '_lte'
  | '_gt'
  | '_gte'
  | '_in'
  | '_nin'
  | '_like'
  | '_nlike'
  | '_is_null'

export type FilterValues =
  | string
  | number
  | boolean
  | null
  | Date
  | string[]
  | number[]
  | Date[]
  | boolean[]
  | Buffer

export interface IFilter extends Record<string, Record<Partial<OperatorsType>, FilterValues> | unknown> {
  _and?: IFilter[]
  _or?: IFilter[]
  _exists?: {
    [key: string]: boolean
  }
}
