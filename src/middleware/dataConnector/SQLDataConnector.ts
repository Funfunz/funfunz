import { IConnector } from '../../generator/configurationTypes'
import Knex from 'knex'
import Debug from 'debug'
import type { ICreateArgs, IQueryArgs, IRemoveArgs, IUpdateArgs } from './index'
import { FilterValues, IFilter, OperatorsType } from '../utils/filter'
import { getPKs, getTableConfig } from '../utils'

const debug = Debug('funfunz:SQLDataConnector')

export class SQLDataConnector {
  public db: Knex
  constructor(connector: IConnector) {
    this.db = Knex({
      client: 'mysql2',
      connection: {
        dateStrings: true,
        ...connector.config,
      },
    })
    debug('Start')
    Object.keys(connector).forEach(
      (key) => {
        debug(key, (connector)[key])
      }
    )
    debug('End')
  }

  public query(args: IQueryArgs): Promise<unknown[] | unknown> {
    const query = this.db(args.entityName)
    if (args.fields) {
      query.select(args.fields)
    }
    if (args.filter) {
      this.applyQueryFilters(query, args.filter)
    }
    if (args.skip || args.take) {
      this.paginate(query, args.skip, args.take)
    }
    if (args.count) {
      query.count('*', {as: 'count'})
    }
    return query.then(
      (results: Record<string, unknown>[]) => {
        if (args.count) {
          return results[0].count || 0
        }
        return args.relation === 'N1' ? results[0] : results
      }
    )
  }

  public update(args: IUpdateArgs): Promise<unknown[] | unknown> {
    const updateQuery = this.db(args.entityName)

    if (args.filter) {
      this.applyQueryFilters(updateQuery, args.filter)
    }

    return updateQuery.update(args.data).then(
      (updatedCount) => {
        if (updatedCount === 0) {
          return []
        }
        return this.query(args).then(
          (results) => {
            if (Array.isArray(results) && results.length) {
              return results[0]
            }
            return undefined
          }
        )
      }
    )
  }

  public create(args: ICreateArgs): Promise<unknown[] | unknown> {
    const createQuery = this.db(args.entityName)
    
    return createQuery.insert(args.data).then(
      (ids) => {
        if (ids.length === 0) {
          return []
        }
        const tableConfig = getTableConfig(args.entityName)
        const pks = getPKs(tableConfig)
        
        const queryArgs: IQueryArgs = args
        queryArgs.filter = {
          _and: []
        }
        
        ids.forEach(
          (id) => {
            pks.forEach(
              (pk, index) => {
                queryArgs.filter?._and?.push({
                  [pk]: {
                    _eq: Array.isArray(id) ? id[index] : id
                  }
                })
              }
            )
          }
        )
        
        return this.query(queryArgs).then(
          (results) => {
            if (Array.isArray(results) && results.length) {
              return results[0]
            }
            return undefined
          }
        )
      }
    )
  }

  public remove(args: IRemoveArgs): Promise<number> {
    const removeQuery = this.db(args.entityName)

    this.applyQueryFilters(removeQuery, args.filter)

    return removeQuery.del()
  }

  private paginate(query: Knex.QueryBuilder, skip = 0, take = 0) {
    skip = typeof skip === 'string' ? parseInt(skip, 10) : skip
    take = typeof take === 'string' ? parseInt(take, 10) : take
    if (take > 0) {
      query.offset((skip) * take).limit(take)
    }
    return query
  }

  private applyQueryFilters(
    QUERY: Knex.QueryBuilder,
    filters: IFilter,
    unionOperator?: string,
  ): Knex.QueryBuilder<Record<string, unknown>, unknown> {
    Object.keys(filters).forEach(
      (key) => {
        if (key === '_and' || key === '_or') {
          
          const value = (filters[key] as IFilter['_and'] | IFilter['_or']) || []
        
          let where = 'where'
          if (key === '_or'){
            where = 'orWhere'
          } else if (key === '_and') {
            where = 'andWhere'
          }
  
          value.forEach(
            (entry) => {
              const newFilters = {} 
              const entryKey = Object.keys(entry)[0]
              newFilters[entryKey] = entry[entryKey]
              QUERY[where](
                (innerQuery) => {
                  this.applyQueryFilters(
                    innerQuery,
                    newFilters,
                    key === '_and' ? 'and' : 'or'
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
          if (unionOperator) {
            finalUnionOperator = unionOperator
          }
          this.operatorMatcher(OPERATOR, key, (filters[key] as Record<string, FilterValues>)[OPERATOR], QUERY, finalUnionOperator)
        }
      }
    )
    return QUERY
  }

  private operatorMatcher(
    operator: OperatorsType,
    column: string,
    value: FilterValues,
    query: Knex.QueryBuilder,
    unionOperator?: string
  ) {
    let where = 'where'
    if (unionOperator) {
      where = unionOperator === 'or' ? 'orWhere' : 'where'
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
}