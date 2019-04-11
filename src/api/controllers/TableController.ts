import database, { Database } from '@root/api/db'
import { HttpException, IMCRequest, IMCResponse, IUser } from '@root/api/types'
import {
  addToResponse,
  applyQueryFilters,
  applyQuerySearch,
  catchMiddleware,
  filterVisibleTableColumns,
  getColumnsWithRelations,
  getTableConfig,
  hasAuthorization,
  nextAndReturn,
  runHook
} from '@root/api/utils'
import { IColumnRelation, ITableInfo } from '@root/configGenerator'
import Bluebird from 'bluebird'
import Debug from 'debug'
import { NextFunction, Request } from 'express'
import Knex from 'knex'

const debug = Debug('funfunzmc:controller-table')

interface IToRequestItem {
  values: Set<number>,
  key: string,
  display: string,
  foreignKeyColumn: string
}

interface IToRequest {
  [key: string]: IToRequestItem,
}

function toRequestBuilder(relation: IColumnRelation, columnName: string): IToRequestItem {
  return {
    values: new Set<number>(),
    key: relation.key,
    display: relation.display,
    foreignKeyColumn: columnName,
  }
}

class TableController {
  constructor() {
    debug('Created')
  }

  public getTableConfig(req: IMCRequest, res: IMCResponse, next: NextFunction) {
    const TABLE_CONFIG = getTableConfig(req.params.table)
    const RESULT = {
      columns: TABLE_CONFIG.columns,
      name: TABLE_CONFIG.name,
      pk: TABLE_CONFIG.pk,
      verbose: TABLE_CONFIG.verbose,
      chips: TABLE_CONFIG.chips || [],
      itemTitle: TABLE_CONFIG.itemTitle,
    }

    if (!hasAuthorization(TABLE_CONFIG.roles, req.user)) {
      return catchMiddleware(next)(new HttpException(401, 'Not authorized'))
    }
    addToResponse(res, 'results')(RESULT)
    return nextAndReturn(next)(RESULT)
  }

  public getTableData(req: IMCRequest, res: IMCResponse, next: NextFunction) {
    const PAGE_NUMBER = req.query.page || 0
    const TABLE_NAME = req.params.table
    const ORDER = req.query.order || null
    const TABLE_CONFIG = getTableConfig(TABLE_NAME)
    const COLUMNS = filterVisibleTableColumns(TABLE_CONFIG, 'main')
    let LIMIT = 10

    if (!hasAuthorization(TABLE_CONFIG.roles, req.user)) {
      return catchMiddleware(next)(new HttpException(401, 'Not authorized'))
    }
    if (!database.db) {
      return catchMiddleware(next)(new HttpException(500, 'No database'))
    }
    const DB = database.db
    let QUERY = DB.select(COLUMNS).from(TABLE_NAME)
    if (req.query.filter) {
      QUERY = applyQueryFilters(QUERY, req.query.filter, TABLE_CONFIG)
    }

    if (req.query.search) {
      QUERY = applyQuerySearch(QUERY, req.query.search, TABLE_CONFIG)
    }

    if (ORDER) {
      const ORDER_OBJ = JSON.parse(ORDER)
      if (Array.isArray(ORDER_OBJ)) {
        QUERY.orderBy(ORDER_OBJ)
      } else {
        QUERY.orderBy(ORDER_OBJ.column, ORDER_OBJ.order)
      }
    }

    if (req.query.limit) {
      LIMIT = parseInt(req.query.limit, 10)
    }
    if (LIMIT > 0) {
      QUERY.offset((PAGE_NUMBER) * LIMIT).limit(LIMIT)
    }

    return runHook(TABLE_CONFIG, 'getTableData', 'before', req, res, database.db).then(
      (hookResult) => {
        if (hookResult) {
          if (hookResult.filter) {
            Object.keys(hookResult.filter).forEach(
              (column) => {
                if (Array.isArray(hookResult.filter[column])) {
                  QUERY.whereIn(column, hookResult.filter[column])
                }
              }
            )
          }
        }
        console.log(QUERY.toQuery())
        return QUERY
      }
    ).then(
      (results) => {
        if (req.query.friendlyData) {
          return this.addVerboseRelatedData(results, TABLE_CONFIG, DB)
        }
        return results
      }
    ).then(
      (results) => {
        return runHook(TABLE_CONFIG, 'getTableData', 'after', req, res, database.db, results)
      }
    ).then(
      addToResponse(res, 'results')
    ).then(
      nextAndReturn(next)
    )
  }

  public getTableCount(req: IMCRequest, res: IMCResponse, next: NextFunction) {
    const TABLE_NAME = req.params.table
    const TABLE_CONFIG = getTableConfig(TABLE_NAME)

    return this.requirementsCheck(TABLE_CONFIG, req.user, database, next).then(
      (DB) => {
        let QUERY = DB(TABLE_NAME).select('*')
        if (req.query.search) {
          QUERY = applyQuerySearch(QUERY, req.query.search, TABLE_CONFIG)
        }
        return Promise.all([DB, QUERY])
      }
    ).then(
      ([DB, results]) => {
        return runHook(TABLE_CONFIG, 'getTableCount', 'after', req, res, DB, results)
      }
    ).then(
      addToResponse(res, 'count')
    ).then(
      nextAndReturn(next)
    ).catch(
      catchMiddleware(next)
    )
  }

  public getRow(req: IMCRequest, res: IMCResponse, next: NextFunction) {
    const TABLE_NAME = req.params.table
    const TABLE_CONFIG = getTableConfig(TABLE_NAME)

    return this.requirementsCheck(TABLE_CONFIG, req.user, database, next).then(
      (DB) => {
        const requestedColumns = filterVisibleTableColumns(TABLE_CONFIG, 'detail')

        return DB.select(requestedColumns)
          .from(`${req.params.table}`)
          .where('id', req.params.id)
      }
    ).then(
      (results) => {
        let relationQueries: Array<Bluebird<{}>> = []
        if (req.query.includeRelations) {
          relationQueries = this.getRelationQueries(TABLE_CONFIG, results[0].id)
        }

        if (relationQueries.length) {
          return Promise.all([
            results[0],
            ...relationQueries,
          ])
        }

        return Promise.all([
          results[0],
        ])
      }
    ).then(
      this.mergeRelatedData
    ).then(
      (results) => {
        return runHook(TABLE_CONFIG, 'getRow', 'after', req, res, database.db, results)
      }
    ).then(
      addToResponse(res, 'results')
    ).then(
      nextAndReturn(next)
    ).catch(
      catchMiddleware(next)
    )
  }

  public insertRow(req: IMCRequest, res: IMCResponse, next: NextFunction) {
    const TABLE_NAME = req.params.table
    const TABLE_CONFIG = getTableConfig(TABLE_NAME)

    return this.requirementsCheck(TABLE_CONFIG, req.user, database, next).then(
      (DB) => {
        TABLE_CONFIG.columns.forEach(
          (column) => {
            if (column.type === 'datetime') {
              req.body.data[column.name] = new Date(req.body.data[column.name] || null)
            } else if (column.type === 'tinyint(1)') {
              req.body.data[column.name] = column.type ? 1 : 0
            }
          }
        )
        return DB(req.params.table).insert(req.body.data)
      }
    ).then(
      (results) => {
        return runHook(TABLE_CONFIG, 'insertRow', 'after', req, res, database.db, results)
      }
    ).then(
      (results) => {
        addToResponse(res, 'results')(results)
      }
    ).then(
      nextAndReturn(next)
    ).catch(
      catchMiddleware(next)
    )
  }

  public updateRow(req: IMCRequest, res: IMCResponse, next: NextFunction) {
    const TABLE_NAME = req.params.table
    const TABLE_CONFIG = getTableConfig(TABLE_NAME)

    return this.requirementsCheck(TABLE_CONFIG, req.user, database, next).then(
      (DB) => {
        TABLE_CONFIG.columns.forEach(
          (column) => {
            if (column.type === 'datetime') {
              req.body.data[column.name] = new Date(req.body.data[column.name] || null)
            }
          }
        )

        return DB(TABLE_NAME).where('id', req.params.id).update(req.body.data)
      }
    ).then(
      (results) => {
        return runHook(TABLE_CONFIG, 'updateRow', 'after', req, res, database.db, results)
      }
    ).then(
      addToResponse(res, 'results')
    ).then(
      nextAndReturn(next)
    ).catch(
      catchMiddleware(next)
    )
  }

  public deleteRow(req: IMCRequest, res: IMCResponse, next: NextFunction) {
    const TABLE_NAME = req.params.table
    const TABLE_CONFIG = getTableConfig(TABLE_NAME)

    return this.requirementsCheck(TABLE_CONFIG, req.user, database, next).then(
      (DB) => {
        return DB(TABLE_NAME).where('id', req.params.id).del()
      }
    ).then(
      (results) => {
        return runHook(TABLE_CONFIG, 'deleteRow', 'after', req, res, database.db, results)
      }
    ).then(
      addToResponse(res, 'results')
    ).then(
      nextAndReturn(next)
    ).catch(
      catchMiddleware(next)
    )
  }

  private addVerboseRelatedData(results: any[], TABLE_CONFIG: ITableInfo, DB: Knex) {
    const toRequest: IToRequest = {}
    const COLUMNS_WITH_RELATIONS = getColumnsWithRelations(TABLE_CONFIG)
    results.forEach(
      (row: any, index: number) => {
        COLUMNS_WITH_RELATIONS.forEach(
          (column) => {
            if (!column.relation) {
              throw new HttpException(500, 'Column should have a relation')
            }
            const RELATION_TABLE_NAME = column.relation.table

            if (!toRequest[RELATION_TABLE_NAME]) {
              toRequest[RELATION_TABLE_NAME] = toRequestBuilder(column.relation, column.name)
            }

            toRequest[RELATION_TABLE_NAME].values.add(row[column.name])
          }
        )
      }
    )

    const relationQueries: Knex.QueryBuilder[] = []
    Object.keys(toRequest).forEach(
      (tableName) => {
        relationQueries.push(
          DB.select(toRequest[tableName].display, toRequest[tableName].key)
            .from(tableName)
            .whereIn(toRequest[tableName].key, Array.from(toRequest[tableName].values.values()))
        )
      }
    )

    return Promise.all<any[]>(relationQueries).then(
      (relationResults) => {
        const MATCHER: {
          [foreignKeyColumn: string]: {
            [value: string]: string
          }
        } = {}
        Object.values(toRequest).forEach(
          (requestedTable, index) => {
            const FOREIGN_KEY_COLUMN = requestedTable.foreignKeyColumn
            MATCHER[FOREIGN_KEY_COLUMN] = {}
            relationResults[index].forEach(
              (relationRow: any) => {
                const CURRENT_VALUE = relationRow[requestedTable.key]
                const VALUE_TO_DISPLAY = relationRow[requestedTable.display]
                MATCHER[FOREIGN_KEY_COLUMN][CURRENT_VALUE] = VALUE_TO_DISPLAY
              }
            )
          }
        )
        return results.map(
          (row: any) => {
            Object.values(toRequest).forEach(
              (requestedTable) => {
                const ROW_KEY = requestedTable.foreignKeyColumn
                row[ROW_KEY] = MATCHER[ROW_KEY][row[ROW_KEY]]
              }
            )
            return row
          }
        )
      }
    )
  }

  private requirementsCheck(
    tableConfig: ITableInfo,
    user: IUser | undefined,
    dbInstance: Database,
    next: (param?: any) => void
  ) {
    if (!hasAuthorization(tableConfig.roles, user)) {
      return Promise.reject(new HttpException(401, 'Not authorized'))
    }
    if (!dbInstance.db) {
      return catchMiddleware(next)(new HttpException(500, 'No database'))
    }
    return Promise.resolve(dbInstance.db)
  }

  private getRelationQueries(TABLE_CONFIG: ITableInfo, parentId: any) {
    const relationQueries: Array<Bluebird<{}>> = []
    if (TABLE_CONFIG.relations && TABLE_CONFIG.relations.manyToOne) {
      const MANY_TO_ONE = TABLE_CONFIG.relations.manyToOne
      const KEYS: string[] = Object.keys(MANY_TO_ONE)
      KEYS.forEach(
        (tableName) => {
          relationQueries.push(
            this.getRelatedRow(
              tableName,
              MANY_TO_ONE[tableName],
              parentId
            )
          )
        }
      )
    }

    return relationQueries
  }

  private getRelatedRow(tableName: string, columnName: string, parentId: any) {
    if (!database.db) {
      throw new HttpException(500, 'No database')
    }
    const TABLE_NAME = tableName
    const TABLE_CONFIG = getTableConfig(TABLE_NAME)

    const requestedColumns = filterVisibleTableColumns(TABLE_CONFIG, 'detail').filter(
      (column) => column !== columnName
    )

    return database.db.select(requestedColumns)
      .from(tableName)
      .where(columnName, parentId).then(
        (results) => ({
          results,
          tableName,
        })
      )
  }

  private mergeRelatedData([results, ...relations]: any) {
    if (relations && relations.length) {
      relations.forEach(
        (relation: {tableName: string, results: any[]}) => {
          results[relation.tableName] = relation.results
        }
      )
    }

    return results
  }
}

export default TableController
