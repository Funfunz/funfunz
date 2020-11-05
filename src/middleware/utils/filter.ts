import Knex from 'knex'
import { getPKs } from './index'
import { ITableInfo, IRelationMN, IRelation } from '../../generator/configurationTypes'
import database from '../db/index'

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

export function applyParentTableFilters(
  QUERY: Knex.QueryBuilder,
  table: ITableInfo,
  parentTable: ITableInfo,
  parentObj: Record<string, FilterValues>
): Promise<unknown> | null | undefined {
  let relation: IRelation | undefined = oneToManyRelation(table, parentTable)
  if (relation) {
    const pks = getPKs(parentTable)
    if (pks.length > 1) {
      throw new Error('Multiple pks relation not supported')
    }
    const pk = pks[0]
    const value = parentObj[pk]
    return applyQueryFilters(QUERY, { [relation.foreignKey]: { _eq: value }})
  }

  relation = manyToOneRelation(table, parentTable)
  if (relation) {
    const pks = getPKs(table)
    if (pks.length > 1) {
      throw new Error('Multiple pks relation not supported')
    }
    const pk = pks[0]
    const value = parentObj[relation.foreignKey]
    return applyQueryFilters(QUERY, { [pk]: { _eq: value }}).first()
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
    return database && database.db && database.db(
      relation.relationalTable
    ).select([
      relation.foreignKey,
      relation.remoteForeignKey,
    ]).where(
      relation.foreignKey,
      parentObj[remotePk]
    ).then((results) => {
      const IDS = results.map((obj) => {
        return obj[(relation as IRelationMN).remoteForeignKey]
      })
      const filter = {
        [pk]: {
          $in: IDS
        }
      }
      return applyQueryFilters(QUERY, filter)
    })
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

type OperatorsType = typeof operators[0]

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

interface IFilter extends Record<string, Record<Partial<OperatorsType>, FilterValues> | unknown> {
  _and?: IFilter[]
  _or?: IFilter[]
  _not?: IFilter[]
  _exists?: {
    [key: string]: boolean
  }
  
}

function operatorMatcher(
  operator: OperatorsType,
  column: string,
  value: FilterValues,
  query: Knex.QueryBuilder,
  unionOperator?: string
) {
  let where = 'where'
  if (unionOperator) {
    where = `${unionOperator}Where`
  }
  switch (operator) {
  case '_eq':
    return query[where](column, value)
  case '_neq':
    return query[`${where}Not`](column, value)
  case '_lt':
    return query[where](column, '<', value)
  case '_lte':
    return query[where](column, '<=', value) 
  case '_gt':
    return query[where](column, '>', value)
  case '_gte':
    return query[where](column, '>=', value)
  case '_in':
    return query[`${where}In`](column, value as FilterValues[]) 
  case '_nin':
    return query[`${where}NotIn`](column, value as FilterValues[])
  case '_like':
    return query[where](column, 'like', value)
  case '_nlike':
    return query[where](column, 'not like', value) 
  case '_is_null':
    return query[`${where}Null`](column) 
  }
  
}

export function applyQueryFilters(
  QUERY: Knex.QueryBuilder,
  filters: IFilter,
  unionOperator?: string,
  prevIndex?: number
): Knex.QueryBuilder<Record<string, unknown>, unknown> {
  Object.keys(filters).forEach(
    (key, index) => {
      let newIndex = index
      if (prevIndex) {
        newIndex += prevIndex
      }
      if (key === '_and' || key === '_or') {
        
        const value = (filters[key] as IFilter['_and'] | IFilter['_or']) || []
      
        let where = 'where'
        if (key === '_or'){
          where = 'orWhere'
        } else if (key === '_and') {
          where = 'andWhere'
        } else if (unionOperator) {
          where = `${unionOperator}Where`
        }

        value.forEach(
          (entry) => {
            const newFilters = {} 
            const entryKey = Object.keys(entry)[0]
            newFilters[entryKey] = entry[entryKey]
            QUERY[where](
              (innerQuery) => {
                applyQueryFilters(
                  innerQuery,
                  newFilters,
                  key === '_and' ? 'and' : 'or',
                  0
                )
              }
            )
          }
        )
      } else if (key === '_exists') {
        console.log('exists')
      } else {
        const OPERATOR: OperatorsType = Object.keys(filters[key] as Record<OperatorsType, FilterValues>)[0] as OperatorsType
        let finalUnionOperator = ''
        
        if (newIndex > 0) {
          finalUnionOperator = 'and'
        }
        if (unionOperator) {
          finalUnionOperator = unionOperator
        }
        operatorMatcher(OPERATOR, key, (filters[key] as Record<string, FilterValues>)[OPERATOR], QUERY, finalUnionOperator)
      }
    }
  )
  return QUERY
}