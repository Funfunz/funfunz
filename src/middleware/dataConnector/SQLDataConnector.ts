import { IConnector } from '../../generator/configurationTypes'
import Knex from 'knex'
import Debug from 'debug'
import type { ICreateArgs, IQueryArgs, IRemoveArgs, IUpdateArgs } from './index'
import { FilterValues, IFilter, OperatorsType } from '../utils/filter'

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
    if (args.count) {
      query.count('*', {as: 'count'}).first()
    }
    if (args.filter) {
      this.applyQueryFilters(query, args.filter)
    }
    if (args.skip || args.take) {
      this.paginate(query, args.skip, args.take)
    }
    console.log(query.toSQL())
    return query.then(
      (results: unknown[]) => {
        if (!results) {
          return []
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
        return this.query(args)
      }
    )
  }

  public create(args: ICreateArgs): Promise<unknown[] | unknown> {
    const createQuery = this.db(args.entityName)
    
    return createQuery.insert(args.data, args.fields || ['*']).then(
      (ids) => {
        if (ids.length === 0) {
          return []
        }
        return this.query(args)
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
                  this.applyQueryFilters(
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
}