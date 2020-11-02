import database, { Database } from '../db'
import { HttpException, IFunfunzRequest, IFunfunzResponse, IUser } from '../types'
import config from '../utils/configLoader'
import { Hooks, IColumnInfo, IRelation, IRelation1N, IRelationMN, IRelationN1, ITableInfo } from '../../generator/configurationTypes'
import { ErrorRequestHandler } from 'express'
import Knex from 'knex'

// error handler
export const errorHandler: ErrorRequestHandler = (err, req, res) => {
  res.status(err.status || 500)
  if (process.env.NODE_ENV !== 'developement' && process.env.NODE_ENV !== 'test') {
    res.send('Error')
  } else {
    res.json({
      message: err.message,
    })
  }
}

/**
 * checks for user authorization against a list of roles
 * of the list has the role "all" return always true
 * @param {string[]} roles - a list of roles
 * @param {IUser} user - the express session user
 *
 * @returns {boolean} true if authorized, false if not
 */
export function hasAuthorization(
  roles: string[],
  user: IUser = {
    roles: [
      {
        id: 0,
        name: 'unauthenticated',
      },
    ],
  }
): boolean {
  let isAuthorized = true
  if (roles && roles.length) {
    isAuthorized = !!roles.find(
      (role: string) => {
        if (role === 'all') {
          return true
        }
        return !!(user.roles && user.roles.find(
          (userRole) => {
            return (userRole.name === role)
          }
        ))
      }
    )
  }

  return isAuthorized
}

/**
 * given a table, filters the visible columns for the main or detail backoffice pages
 * @param {ITableInfo} table - a table configuration
 * @param {'main' | 'detail'} target - backoffice page
 *
 * @returns {IColumnInfo[]} array of filtered columns
 */
export function filterVisibleTableColumns(table: ITableInfo, target: 'list' | 'detail' | 'relation'): string[] {
  return table.columns.filter((column) => {
    if (column.model.isPk) {
      return true
    } else if (target === 'list') {
      return column.visible.list
    } else if (target === 'detail') {
      return column.visible.detail
    } else if (target === 'relation') {
      return column.visible.relation
    } else {
      return false
    }
  }).map((column) => {
    return column.name
  })
}

export function runHook(
  TABLE: ITableInfo,
  hook: Hooks,
  instance: 'after' | 'before',
  req: IFunfunzRequest,
  res: IFunfunzResponse,
  databaseInstance: Knex | null,
  results?: Record<string, unknown>
): Promise<number | Record<string, unknown> | undefined> {
  if (TABLE.hooks && TABLE.hooks[hook]) {
    const HOOK = TABLE.hooks[hook]
    if (databaseInstance && HOOK && HOOK[instance]) {
      const CALLER  = HOOK[instance]
      return CALLER
        ? CALLER(req, res, databaseInstance, TABLE.name, results)
        : Promise.resolve(hook === 'getTableCount' ? (results?.length as number) : results)
    }
  }
  return Promise.resolve(hook === 'getTableCount' ? (results?.length as number) : results)
}

/**
 * returns the table configuration based on the table name
 * @param {string} TABLE_NAME - the name of the table
 *
 * @returns {ITableInfo} table configuration
 */
export function getTableConfig(TABLE_NAME: string): ITableInfo {
  return config().settings.filter(
    (tableItem) => tableItem.name === TABLE_NAME
  )[0]
}

/**
 * returns the columns configuration list transformed into an key:value object
 * where key equals to the column name, and value equals to the column configuration
 * @param {ITableInfo} TABLE_CONFIG - the table configuration
 *
 * @returns {{ [key: string]: IColumnInfo }} {[columnName]:[columnConfig]} object
 */
export function getColumnsByName(TABLE_CONFIG: ITableInfo): {
  [key: string]: IColumnInfo;
} {
  const columnsByName: {
    [key: string]: IColumnInfo
  } = {}

  TABLE_CONFIG.columns.forEach(
    (column) => {
      columnsByName[column.name] = column
    }
  )

  return columnsByName
}

/**
 * returns the columns configuration list for the columns containing a relation
 * @param {ITableInfo} TABLE_CONFIG - the table configuration
 *
 * @returns {IColumnInfo[]} array of relation columns
 */
export function getColumnsWithRelations(TABLE_CONFIG: ITableInfo): IColumnInfo[] {
  return TABLE_CONFIG.columns.filter(
    (column) => column.relation
  )
}

/**
 * helper function that sets the filters and search query to a Knex query object
 * @param {Knex.QueryBuilder} DB_QUERY - Knex query object
 * @param {object} reqQuer - parsed req.query object from express
 * @param {ITableInfo} TABLE_CONFIG - table configuration
 *
 * @returns {Knex.QueryBuilder} updated Knex query object
 */
export function applyQueryFiltersSearch(
  DB_QUERY: Knex.QueryBuilder,
  reqQuery: IFilter,
): Knex.QueryBuilder<Record<string, unknown>, unknown> {
  return applyQueryFilters(DB_QUERY, reqQuery)
}

const oneToManyRelation = (table: ITableInfo, parentTable: ITableInfo): IRelation1N | undefined => {
  return parentTable.relations && parentTable.relations.find(
    (relation) => {
      return relation.type === '1:n' && relation.remoteTable === table.name
    }
  ) as IRelation1N | undefined
}

const manyToOneRelation = (table: ITableInfo, parentTable: ITableInfo): IRelationN1 | undefined => {
  return parentTable.relations && parentTable.relations.find((relation) => {
    return relation.type === 'n:1' && relation.remoteTable === table.name
  }) as IRelationN1 | undefined
}

const manyToManyRelation = (table: ITableInfo, parentTable: ITableInfo): IRelationMN | undefined => {
  return parentTable.relations && parentTable.relations.find((relation) => {
    return relation.type === 'm:n' && relation.remoteTable === table.name
  }) as IRelationMN | undefined
}

export function applyParentTableFilters(
  QUERY: Knex.QueryBuilder,
  table: ITableInfo,
  parentTable: ITableInfo,
  parentObj: Record<string, Values>
): Promise<unknown> | null | undefined {
  let relation: IRelation | undefined = oneToManyRelation(table, parentTable)
  if (relation) {
    const pks = getPKs(parentTable)
    if (pks.length > 1) {
      throw new Error('Multiple pks relation not supported')
    }
    const pk = pks[0]
    const value = parentObj[pk]
    console.log({ [relation.foreignKey]: { _eq: value }})
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

  relation = manyToManyRelation(table, parentTable)
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

type Operators =
  | '_eq'
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

export type Values =
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

interface IFilter {
  [key: string]: {[key in Operators]: Values } | unknown
  _and?: IFilter[]
  _or?: IFilter[]
  _not?: IFilter[]
  _exists?: {
    [key: string]: boolean
  }
  
}


function whereMatcher(
  operator: Operators,
  column: string,
  value: Values,
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
    return query[`${where}In`](column, value as Values[]) 
  case '_nin':
    return query[`${where}NotIn`](column, value as Values[])
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
            console.log('NEWFILTERS:', newFilters)
            QUERY[where](
              (innerQuery) => {
                applyQueryFilters(
                  innerQuery,
                  newFilters,
                  key === '_and' ? 'and' : 'or',
                  0
                )
                console.log('Finished inner')
              }
            )
          }
        )
      } else if (key === '_exists') {
        console.log('exists')
      } else {
        const OPERATOR: Operators = Object.keys(filters[key] as Record<Operators, Values>)[0] as Operators
        let finalUnionOperator = ''
        
        if (newIndex > 0) {
          finalUnionOperator = 'and'
        }
        if (unionOperator) {
          finalUnionOperator = unionOperator
        }
        whereMatcher(OPERATOR, key, (filters[key] as Record<string, Values>)[OPERATOR], QUERY, finalUnionOperator)
      }
    }
  )
  return QUERY
}

export function applyQuerySearch(QUERY: Knex.QueryBuilder, search: string, TABLE_CONFIG: ITableInfo): Knex.QueryBuilder<Record<string, unknown>, unknown> {
  const searchFields = TABLE_CONFIG.columns.filter((c) => c.searchable).map((c) => c.name) || []
  QUERY.where(function() {
    searchFields.forEach(
      (searchField, index) => {
        index === 0 ?
          this.where(searchField, 'like', '%' + search + '%') :
          this.orWhere(searchField, 'like', '%' + search + '%')
      }
    )
  })

  return QUERY
}

export function getPKs(TABLE_CONFIG: ITableInfo): string[] {
  return TABLE_CONFIG.columns.filter((column) => {
    return column.model.isPk
  }).map((column) => {
    return column.name
  })
}

/**
 * helper function to check for undefined, null, and empty values
 * @param {any} val - a variable
 *
 * @returns {boolean} true or false if val is a nullable value
 */
export function isNull(val: unknown): boolean {
  return val === '' || val === undefined || val === null
}

/**
 * checks for user authorization to the table based on the type of access requested
 * @param {ITableInfo} tableConfig - a table configuration
 * @param {'read' | 'write' | 'delete'} accessType - the type of access being requested
 * @param {IUser | undefined} user - the express session user of none for unauthenticated users
 * @param {Database} dbInstance - the database instance
 *
 * @returns {Promise<Knex>} the database connector
 */
export function requirementsCheck(
  tableConfig: ITableInfo,
  accessType: 'read' | 'create' | 'update' | 'delete',
  user: IUser | undefined,
  dbInstance: Database
): Promise<Knex<Record<string, unknown>, unknown[]>> {
  if (!hasAuthorization(tableConfig.roles[accessType], user)) {
    return Promise.reject(new HttpException(401, 'Not authorized'))
  }
  if (!dbInstance.db) {
    return Promise.reject(new HttpException(500, 'No database'))
  }
  return Promise.resolve(dbInstance.db)
}
