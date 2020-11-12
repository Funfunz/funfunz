import { isNull, getPKs } from './index'
import { ITableInfo, IRelationMN, IRelation } from '../../generator/configurationTypes'
import { globalGraph } from '../routes'

const oneToManyRelation = (table: ITableInfo, parentTable: ITableInfo): IRelation | undefined => {
  return parentTable.relations?.find(
    (relation) => {
      return relation.type === '1:n' && relation.remoteTable === table.name
    }
  )
}

const manyToOneRelation = (table: ITableInfo, parentTable: ITableInfo): IRelation | undefined => {
  return parentTable.relations?.find(
    (relation) => {
      return relation.type === 'n:1' && relation.remoteTable === table.name
    }
  )
}

const manyToManyRelation = (table: ITableInfo, parentTable: ITableInfo): IRelation | undefined => {
  return parentTable.relations?.find(
    (relation) => {
      return relation.type === 'm:n' && relation.remoteTable === table.name
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
  table: ITableInfo,
  parentTable: ITableInfo,
  parentObj: Record<string, FilterValues>
): Promise<ParentFilterResult | undefined> {
  let relation: IRelation | undefined = oneToManyRelation(table, parentTable)
  if (relation) {
    const pks = getPKs(parentTable)
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

  relation = manyToOneRelation(table, parentTable)
  if (relation) {
    const pks = getPKs(table)
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

  relation = manyToManyRelation(table, parentTable) as IRelationMN
  if (relation) {
    const pks = getPKs(table)
    if (pks.length > 1) {
      throw new Error('Multiple pks relation not supported')
    }
    const pk = pks[0]
    const remotePks = getPKs(parentTable)
    if (remotePks.length > 1) {
      throw new Error('Multiple pks relation not supported')
    }
    const remotePk = remotePks[0]
    const relationalTable = relation.relationalTable
    const remoteForeignKey = relation.remoteForeignKey
    const result = globalGraph(`query {
      ${relationalTable} (
        filter: {
          ${relation.foreignKey}: {
            _eq: ${parentObj[remotePk]}
          }
        }
      ){
        ${relation.foreignKey}
        ${relation.remoteForeignKey}
      }
    }`)

    return result.then(
      (results) => {
        if (results && results.data) {
          const ids = results.data[relationalTable].map(
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

export const operators = [
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

export type OperatorsType = typeof operators[0]

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