import database, { Database } from '@root/api/db'
import { HttpException, IMCRequest, IMCResponse, IUser } from '@root/api/types'
import {
  addToResponse,
  applyPKFilters,
  applyQueryFiltersSearch,
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
import { NextFunction } from 'express'
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
      relations: TABLE_CONFIG.relations,
      actions: TABLE_CONFIG.actions,
    }

    if (!hasAuthorization(TABLE_CONFIG.roles, req.user)) {
      return catchMiddleware(next, new HttpException(401, 'Not authorized'))
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
      return catchMiddleware(next, new HttpException(401, 'Not authorized'))
    }
    if (!database.db) {
      return catchMiddleware(next, new HttpException(500, 'No database'))
    }
    const DB = database.db
    let QUERY = DB.select(COLUMNS).from(TABLE_NAME)
    QUERY = applyQueryFiltersSearch(QUERY, req.query, TABLE_CONFIG)

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
    ).catch(
      (err) => {
        catchMiddleware(next, err)
      }
    )
  }

  public getTableCount(req: IMCRequest, res: IMCResponse, next: NextFunction) {
    const TABLE_NAME = req.params.table
    const TABLE_CONFIG = getTableConfig(TABLE_NAME)

    return this.requirementsCheck(TABLE_CONFIG, req.user, database, next).then(
      (DB) => {
        let QUERY = DB(TABLE_NAME).select('*')
        QUERY = applyQueryFiltersSearch(QUERY, req.query, TABLE_CONFIG)
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
      (err) => {
        catchMiddleware(next, err)
      }
    )
  }

  public getRowData(req: IMCRequest, res: IMCResponse, next: NextFunction) {
    const TABLE_NAME = req.params.table
    const TABLE_CONFIG = getTableConfig(TABLE_NAME)

    return this.requirementsCheck(TABLE_CONFIG, req.user, database, next).then(
      (DB) => {
        const requestedColumns = filterVisibleTableColumns(TABLE_CONFIG, 'detail')
        let QUERY = DB.select(requestedColumns).from(`${req.params.table}`)
        QUERY = applyPKFilters(QUERY, req.body, TABLE_CONFIG)
        return QUERY
      }
    ).then(
      (results) => {
        let manyToOneRelationQueries: Array<Bluebird<{}>> = []
        let manyToManyRelationQueries: Array<Bluebird<{}>> = []
        const pk = typeof TABLE_CONFIG.pk === 'string' ? TABLE_CONFIG.pk : TABLE_CONFIG.pk[0]
        if (req.query.includeRelations) {
          manyToOneRelationQueries = this.getManyToOneRelationQueries(TABLE_CONFIG, results[0][pk])
          manyToManyRelationQueries = this.getManyToManyRelationQueries(TABLE_CONFIG, results[0][pk])
        }

        return Promise.all([
          results[0],
          Promise.all(manyToOneRelationQueries),
          Promise.all(manyToManyRelationQueries),
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
      (err) => {
        catchMiddleware(next, err)
      }
    )
  }

  public insertRowData(req: IMCRequest, res: IMCResponse, next: NextFunction) {
    const TABLE_NAME = req.params.table
    const TABLE_CONFIG = getTableConfig(TABLE_NAME)
    return this.requirementsCheck(TABLE_CONFIG, req.user, database, next).then(
      (DB) => {
        TABLE_CONFIG.columns.forEach(
          (column) => {
            if (column.type === 'datetime') {
              req.body.data[column.name] = req.body.data[column.name]
                ? new Date(req.body.data[column.name])
                : new Date()
            } else if (column.type === 'tinyint(1)') {
              req.body.data[column.name] = (
                req.body.data[column.name] === '1' || req.body.data[column.name] === 1
              ) ? 1 : 0
            }
          }
        )
        if (Array.isArray(TABLE_CONFIG.pk)) {
          TABLE_CONFIG.pk.forEach(
            (pk) => {
              if (req.body.data[pk] === '' || req.body.data[pk] === undefined) {
                delete req.body.data[pk]
              }
            }
          )
        } else {
          if (req.body.data[TABLE_CONFIG.pk] === '' || req.body.data[TABLE_CONFIG.pk] === undefined) {
            delete req.body.data[TABLE_CONFIG.pk]
          }
        }
        return Promise.all([
          DB,
          runHook(TABLE_CONFIG, 'insertRow', 'before', req, res, DB, req.body.data),
        ])
      }
    ).then(
      ([DB, data]) => {
        return DB(req.params.table).insert(data)
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
      (err) => {
        catchMiddleware(next, err)
      }
    )
  }

  public updateRowData(req: IMCRequest, res: IMCResponse, next: NextFunction) {
    const TABLE_NAME = req.params.table
    const TABLE_CONFIG = getTableConfig(TABLE_NAME)
    if (!req.body.data) {
      next(new HttpException(500, 'Missing data object'))
      return
    }
    return this.requirementsCheck(TABLE_CONFIG, req.user, database, next).then(
      (DB) => {
        const acceptedColumns: string[] = []
        TABLE_CONFIG.columns.forEach(
          (column) => {
            if (column.type === 'datetime') {
              req.body.data[column.name] = new Date(req.body.data[column.name] || null)
            }
            if (req.body.data[column.name] !== undefined) {
              acceptedColumns.push(column.name)
            }
          }
        )

        const toSave: {
          [key: string]: any
        } = {}

        acceptedColumns.forEach(
          (column) => {
            toSave[column] = req.body.data[column]
          }
        )

        let QUERY = DB(TABLE_NAME)
        QUERY = applyPKFilters(QUERY, req.body, TABLE_CONFIG)
        return QUERY.update(toSave)
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
      (err) => {
        catchMiddleware(next, err)
      }
    )
  }

  public deleteRowData(req: IMCRequest, res: IMCResponse, next: NextFunction) {
    const TABLE_NAME = req.params.table
    const TABLE_CONFIG = getTableConfig(TABLE_NAME)

    return this.requirementsCheck(TABLE_CONFIG, req.user, database, next).then(
      (DB) => {
        let QUERY = DB(TABLE_NAME)
        QUERY = applyPKFilters(QUERY, req.body, TABLE_CONFIG)
        return QUERY.del()
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
      (err) => {
        catchMiddleware(next, err)
      }
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
      const ERROR = new HttpException(500, 'No database')
      catchMiddleware(next, ERROR)
      return Promise.reject(ERROR)
    }
    return Promise.resolve(dbInstance.db)
  }

  private getManyToOneRelationQueries(TABLE_CONFIG: ITableInfo, parentId: any) {
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

  private getManyToManyRelationQueries(TABLE_CONFIG: ITableInfo, parentId: any) {
    let relationQueries: Array<Bluebird<{}>> = []
    if (TABLE_CONFIG.relations && TABLE_CONFIG.relations.manyToMany) {
      if (!database.db) {
        throw new HttpException(500, 'No database')
      }
      const DB = database.db
      relationQueries = TABLE_CONFIG.relations.manyToMany.map(
        (relation) => {
          return DB(relation.relationTable).select().where(relation.foreignKey, parentId).then(
            (relationResult: any) => {
              return relationResult.map(
                (relationRow: any) => relationRow[relation.remoteForeignKey]
              )
            }
          ).then(
            (relationRemoteIds) => {
              return Promise.all([
                relation.remoteTable,
                DB(relation.remoteTable).select().whereIn(relation.remoteId, relationRemoteIds),
              ])
            }
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

  private mergeRelatedData([results, manyToOneRelations, manyToManyRelations]: any) {
    if (manyToOneRelations && manyToOneRelations.length) {
      manyToOneRelations.forEach(
        (relation: {tableName: string, results: any[]}) => {
          results[relation.tableName] = relation.results
        }
      )
    }

    if (manyToManyRelations && manyToManyRelations.length) {
      manyToManyRelations.forEach(
        ([verbose, relationsData]: [string, any[]]) => {
          results[verbose] = relationsData
        }
      )
    }

    return results
  }
}

export default TableController
