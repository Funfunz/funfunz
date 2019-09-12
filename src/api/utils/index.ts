import database, { Database } from '@root/api/db'
import { HttpException, IMCRequest, IMCResponse, IUser } from '@root/api/types'
import config from '@root/api/utils/configLoader'
import { Hooks, IColumnInfo, ITableInfo } from '@root/configGenerator'
import { ErrorRequestHandler, NextFunction } from 'express'
import Knex from 'knex'

export function catchMiddleware(next: NextFunction, err: HttpException) {
  if (next) {
    return next(err)
  }
  throw err
}

export function addToResponse(res: IMCResponse, target: string) {
  return function(data: any) {
    if (res) {
      res.data = {
        ...res.data,
        [target]: data,
      }
      return res
    }
    throw new HttpException(500, 'Response object not valid')
  }
}

export function nextAndReturn(next: NextFunction) {
  return function(data: any) {
    if (next) {
      next()
    }
    return Promise.resolve(data)
  }
}

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

export function hasAuthorization(
  tableRoles: string[],
  user: IUser = {
    roles: [
      {
        id: 0,
        name: 'unauthenticated',
      },
    ],
  }
): boolean {
  let isAuthorized: boolean = true
  if (tableRoles && tableRoles.length) {
    isAuthorized = !!tableRoles.find(
      (tableRole: string) => {
        if (tableRole === 'all') {
          return true
        }
        return !!user.roles.find(
          (userRole) => {
            return (userRole.name === tableRole);
          }
        )
      }
    )
  }

  return isAuthorized
}

export function filterVisibleTableColumns(table: ITableInfo, target: 'main' | 'detail') {
  const toKeep: {
    [key: string]: boolean
  } = {}
  if (table.chips) {
    table.chips.forEach(
      (chip) => {
        chip.columns.forEach(
          (column) => {
            toKeep[column.name] = true
          }
        )
      }
    )
  }
  return table.columns.filter(
    (column) => column.visible[target] || table.pk.indexOf(column.name) >= 0  || toKeep[column.name]
  ).map(
    (column) => column.name
  )
}

export function runHook(
  TABLE: ITableInfo,
  hook: Hooks,
  instance: 'after' | 'before',
  req: IMCRequest,
  res: IMCResponse,
  database: Knex | null,
  results?: any
) {
  if (TABLE.hooks && TABLE.hooks[hook]) {
    const HOOK = TABLE.hooks[hook]
    if (database && HOOK && HOOK[instance]) {
      const CALLER  = HOOK[instance]
      return CALLER ?
        instance === 'before' ?
          CALLER(req, res, database, TABLE.name, results)
          :
          CALLER(req, res, database, TABLE.name, results)
        :
        Promise.resolve(hook === 'getTableCount' ? results.length : results)
    }
  }
  return Promise.resolve(hook === 'getTableCount' ? results.length : results)
}

export function getTableConfig(TABLE_NAME: string) {
  return config().settings.filter(
    (tableItem) => tableItem.name === TABLE_NAME
  )[0]
}

export function getColumnsByName(TABLE_CONFIG: ITableInfo) {
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

export function getColumnsWithRelations(TABLE_CONFIG: ITableInfo) {
  return TABLE_CONFIG.columns.filter(
    (column) => column.relation
  )
}

export function applyQueryFiltersSearch(
  DB_QUERY: Knex.QueryBuilder,
  reqQuery: {[key: string]: any},
  TABLE_CONFIG: ITableInfo
) {
  if (reqQuery.filter) {
    DB_QUERY = applyQueryFilters(DB_QUERY, reqQuery.filter, TABLE_CONFIG)
  }
  if (reqQuery.search) {
    DB_QUERY = applyQuerySearch(DB_QUERY, reqQuery.search, TABLE_CONFIG)
  }
  return DB_QUERY
}

const oneToManyRelation = (table: ITableInfo, parentTable: ITableInfo) => table.relations &&
  table.relations.manyToOne && table.relations.manyToOne[parentTable.name] &&
  table.relations.manyToOne[parentTable.name][0]

const manyToOneRelation = (table: ITableInfo, parentTable: ITableInfo) => parentTable.relations &&
  parentTable.relations.manyToOne && parentTable.relations.manyToOne[table.name] &&
  parentTable.relations.manyToOne[table.name][0]

const manyToManyRelation = (table: ITableInfo, parentTable: ITableInfo) => parentTable.relations &&
  parentTable.relations.manyToMany && table.relations && table.relations.manyToMany && [
    table.relations.manyToMany && table.relations.manyToMany.find((r) => r.remoteTable === parentTable.name),
    parentTable.relations.manyToMany && parentTable.relations.manyToMany.find((r) => r.remoteTable === table.name),
  ]

export function applyParentTableFilters(
  QUERY: Knex.QueryBuilder,
  table: ITableInfo,
  parentTable: ITableInfo,
  parentObj: any
) {

  let relation: any = oneToManyRelation(table, parentTable)
  if (relation) {
    const column = parentTable.columns.find((col) => {
      return col.relation && col.relation.table ? true : false
    })
    if (column) {
      const key = relation.fk
      const value = parentObj[column.name]
      return Promise.resolve(
        applyQueryFilters(QUERY, { [key]: value }, table).first()
      )
    }
  }

  relation = manyToOneRelation(table, parentTable)
  if (relation) {
    const column = table.columns.find((col) => {
      return col.relation && col.relation.table ? true : false
    })
    if (column) {
      const key = column.name
      const value = parentObj[relation.target]
      return Promise.resolve(
        applyQueryFilters(QUERY, { [key]: value }, table)
      )
    }
  }

  relation = manyToManyRelation(table, parentTable)
  if (relation) {
    const [childRelation, parentRelation] = relation
    if (childRelation && parentRelation && parentObj) {
      return database && database.db && database.db(
        childRelation.relationTable
      ).select([
        childRelation.remoteForeignKey,
        parentRelation.remoteForeignKey,
      ]).where(
        childRelation.remoteForeignKey,
        parentObj[childRelation.localId]
      ).then((results) => {
        const IDS = results.map((obj) => {
          return obj[parentRelation.remoteForeignKey]
        })
        const filter = {
          [parentRelation.remoteId]: IDS,
        }
        return applyQueryFilters(QUERY, filter, table)
      })
    }
  }
}

export function applyQueryFilters(
  QUERY: Knex.QueryBuilder,
  filters: string | {[key: string]: any},
  TABLE_CONFIG: ITableInfo
) {
  const columnsByName = getColumnsByName(TABLE_CONFIG)
  const FILTERS = typeof filters === 'string' ? JSON.parse(filters) : filters
  Object.keys(FILTERS).forEach(
    (key, index) => {
      if (columnsByName[key].type === 'int(11)' || columnsByName[key].type === 'datetime') {
        index === 0 ?
          (
            FILTERS[key] === null
              ? QUERY.whereNull(key)
              : Array.isArray(FILTERS[key])
                ? QUERY.whereIn(key, FILTERS[key])
                : QUERY.where({
                  [key]: FILTERS[key],
                })
          ) :
          (
            FILTERS[key] === null
              ? QUERY.andWhere((innerQuery) => {
                  innerQuery.whereNull(key)
                })
              : Array.isArray(FILTERS[key])
                ? QUERY.whereIn(key, FILTERS[key])
                : QUERY.andWhere({
                    [key]: FILTERS[key],
                  })
          )
      } else {
        index === 0 ?
          (
            FILTERS[key] === null
              ? QUERY.whereNull(key)
              : Array.isArray(FILTERS[key])
                ? QUERY.whereIn(key, FILTERS[key])
                : QUERY.where(key, 'like', '%' + FILTERS[key] + '%')
          ) :
          (
            FILTERS[key] === null
              ? QUERY.andWhere((innerQuery) => {
                  innerQuery.whereNull(key)
                })
              : Array.isArray(FILTERS[key])
                ? QUERY.whereIn(key, FILTERS[key])
                : QUERY.andWhere(key, 'like', '%' + FILTERS[key] + '%')
          )
      }
    }
  )

  return QUERY
}

export function applyQuerySearch(QUERY: Knex.QueryBuilder, search: string, TABLE_CONFIG: ITableInfo) {
  const searchFields = TABLE_CONFIG.searchFields || []
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

interface IBodyWithPK {
  pk: {
    [key: string]: string | number
  }
}

export function applyPKFilters(QUERY: Knex.QueryBuilder, body: IBodyWithPK, TABLE_CONFIG: ITableInfo) {
  const columnsByName = getColumnsByName(TABLE_CONFIG)
  const PKS = Object.keys(body.pk)

  if (Array.isArray(TABLE_CONFIG.pk) && TABLE_CONFIG.pk.length !== PKS.length) {
    throw new HttpException(412, 'Incorrect set of primary keys')
  }
  let index = 0
  for (index = 0; index < PKS.length; index += 1) {
    let valid = false
    if (Array.isArray(TABLE_CONFIG.pk)) {
      if (TABLE_CONFIG.pk.indexOf(PKS[index]) !== -1) {
        valid = true
      }
    } else if (TABLE_CONFIG.pk === PKS[index]) {
      valid = true
    }

    if (!valid) {
      throw new HttpException(412, `Primary key ${PKS[index]} missing on table`)
    }

    if (columnsByName[PKS[index]].type === 'int(11)') {
      index === 0 ?
        QUERY.where({
          [PKS[index]]: body.pk[PKS[index]],
        }) :
        QUERY.andWhere({
          [PKS[index]]: body.pk[PKS[index]],
        })
    } else {
      index === 0 ?
        QUERY.where(PKS[index], 'like', '%' + body.pk[PKS[index]] + '%') :
        QUERY.andWhere(PKS[index], 'like', '%' + body.pk[PKS[index]] + '%')
    }
  }

  return QUERY
}

export function isNull(val: any) {
  return val === '' || val === undefined || val === null
}

export function requirementsCheck(
  tableConfig: ITableInfo,
  accessType: 'read' | 'write',
  user: IUser | undefined,
  dbInstance: Database,
  next: (param?: any) => void
) {
  if (!hasAuthorization(tableConfig.roles[accessType], user)) {
    return Promise.reject(new HttpException(401, 'Not authorized'))
  }
  if (!dbInstance.db) {
    const ERROR = new HttpException(500, 'No database')
    catchMiddleware(next, ERROR)
    return Promise.reject(ERROR)
  }
  return Promise.resolve(dbInstance.db)
}
