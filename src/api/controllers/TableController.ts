import database from '@root/api/db'
import { HttpException, IMCRequest, IMCResponse } from '@root/api/types'
import {
  addToResponse,
  catchMiddleware,
  filterTableColumns,
  getTableConfig,
  hasAuthorization,
  nextAndReturn,
  runHook
} from '@root/api/utils'
import { IColumnInfo, ITableInfo } from '@root/configGenerator'
import Bluebird from 'bluebird'
import Debug from 'debug'
import { NextFunction, Request } from 'express'
import Knex from 'Knex'

const debug = Debug('funfunzmc:controller-table')

interface IToRequest {
  [key: string]: {
    values: {
      [key: string]: true,
    },
    key: string,
    display: string,
    parentColumn: string
  },
}

class TableController {
  constructor() {
    debug('Created')
  }

  public getTableConfig(req: IMCRequest, res: IMCResponse, next: NextFunction) {
    let userRoles: string[] = []
    if (req.user && req.user.roles) {
      userRoles = req.user.roles
    }

    const TABLE_CONFIG = getTableConfig(req.params.table)
    const RESULT = {
      columns: TABLE_CONFIG.columns,
      name: TABLE_CONFIG.name,
      pk: TABLE_CONFIG.pk,
      verbose: TABLE_CONFIG.verbose,
    }

    if (hasAuthorization(TABLE_CONFIG.roles, userRoles)) {
      addToResponse(res, 'results')(RESULT)
      return nextAndReturn(next)(RESULT)
    } else {
      return catchMiddleware(next)(new HttpException(401, 'Not authorized'))
    }
  }

  public getTableData(req: IMCRequest, res: IMCResponse, next: NextFunction) {
    const PAGE_NUMBER = req.query.page
    const LIMIT = 10
    const TABLE_NAME = req.params.table

    const TABLE_CONFIG = getTableConfig(TABLE_NAME)

    const COLUMNS = filterTableColumns(TABLE_CONFIG, 'main')

    let userRoles: string[] = []
    if (req.user && req.user.roles) {
      userRoles = req.user.roles
    }

    if (!hasAuthorization(TABLE_CONFIG.roles, userRoles)) {
      return catchMiddleware(next)(new HttpException(401, 'Not authorized'))
    } else {
      if (!database.db) {
        return catchMiddleware(next)(new HttpException(500, 'No database'))
      } else {
        const DB = database.db
        const QUERY = DB.select(COLUMNS).from(TABLE_NAME)
        if (req.query.filter) {
          const columnsByKey: {
            [key: string]: IColumnInfo
          } = {}

          TABLE_CONFIG.columns.forEach(
            (column) => {
              columnsByKey[column.name] = column
            }
          )

          const FILTERS = JSON.parse(req.query.filter)
          Object.keys(FILTERS).forEach(
            (key, index) => {
              if (columnsByKey[key].type === 'int(11)') {
                index === 0 ?
                  QUERY.where({
                    [key]: FILTERS[key],
                  }) :
                  QUERY.andWhere({
                    [key]: FILTERS[key],
                  })
              } else {
                index === 0 ?
                  QUERY.where(key, 'like', '%' + FILTERS[key] + '%') :
                  QUERY.andWhere(key, 'like', '%' + FILTERS[key] + '%')
              }
            }
          )
        }
        return QUERY
          .offset((PAGE_NUMBER || 0) * LIMIT)
          .limit(LIMIT)
          .then(
          (results) => {
            const toRequest: IToRequest = {}
            const RELATIONS = TABLE_CONFIG.columns.filter(
              (column) => column.relation
            )
            results.forEach(
              (row: any, index: number) => {
                RELATIONS.forEach(
                  (column) => {
                    if (column.relation) {
                      if (!toRequest[column.relation.table]) {
                        toRequest[column.relation.table] = {
                          values: {},
                          key: column.relation.key,
                          display: column.relation.display,
                          parentColumn: column.name,
                        }
                      }

                      if (toRequest[column.relation.table].values[row[column.name]] === undefined) {
                        toRequest[column.relation.table].values = {
                          ...toRequest[column.relation.table].values,
                          [row[column.name]]: index,
                        }
                      }
                    }
                  }
                )
              }
            )

            const relationQueries: Knex.QueryBuilder[] = []
            Object.keys(toRequest).forEach(
              (tableName) => {
                relationQueries.push(
                  DB.select(toRequest[tableName].display)
                    .from(tableName)
                    .whereIn(toRequest[tableName].key, Object.keys(toRequest[tableName].values))
                )
              }
            )

            return Promise.all([results, toRequest, ...relationQueries])
          }
        ).then(
          ([results, toRequest, ...relationResults]) => {
            return results.map(
              (row: any) => {
                Object.keys(toRequest).forEach(
                  (tableName, index) => {
                    const ROW_KEY = toRequest[tableName].parentColumn
                    const ROW_INDEX = toRequest[tableName].values[row[ROW_KEY]]
                    row[ROW_KEY] = relationResults[index][ROW_INDEX][toRequest[tableName].display]
                  }
                )
                return row
              }
            )
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
    }
  }

  public getTableCount(req: IMCRequest, res: IMCResponse, next: NextFunction) {
    const TABLE_NAME = req.params.table
    const TABLE_CONFIG = getTableConfig(TABLE_NAME)

    let userRoles: string[] = []
    if (req.user && req.user.roles) {
      userRoles = req.user.roles
    }

    if (!hasAuthorization(TABLE_CONFIG.roles, userRoles)) {
      return catchMiddleware(next)(new HttpException(401, 'Not authorized'))
    } else {
      if (!database.db) {
        return catchMiddleware(next)(new HttpException(500, 'No database'))
      } else {
        return database.db.select('*').from(TABLE_NAME).then(
          (results) => {
            runHook(TABLE_CONFIG, 'getTableCount', 'after', req, res, database.db, results).then(
              addToResponse(res, 'count')
            ).then(
              nextAndReturn(next)
            )
          }
        )
      }
    }
  }

  public getRow(req: IMCRequest, res: IMCResponse, next: NextFunction) {
    const TABLE_NAME = req.params.table
    const TABLE_CONFIG = getTableConfig(TABLE_NAME)

    let userRoles: string[] = []
    if (req.user && req.user.roles) {
      userRoles = req.user.roles
    }

    if (!hasAuthorization(TABLE_CONFIG.roles, userRoles)) {
      return catchMiddleware(next)(new HttpException(401, 'Not authorized'))
    } else {
      if (!database.db) {
        return catchMiddleware(next)(new HttpException(500, 'No database'))
      } else {
        const requestedColumns = filterTableColumns(TABLE_CONFIG, 'detail')

        const query = database.db.select(requestedColumns)
          .from(`${req.params.table}`)
          .where(`id`, req.params.id)

        return query.then(
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
          addToResponse(res, 'result')
        ).then(
          nextAndReturn(next)
        )
      }
    }
  }

  public insertRow(req: Request, res: IMCResponse, next: NextFunction) {
    if (!database.db) {
      return catchMiddleware(next)(new HttpException(500, 'No database'))
    } else {
      return database.db(req.params.table).insert(req.body.data).then(
        addToResponse(res, 'results')
      ).then(
        nextAndReturn(next)
      )
    }
  }

  public updateRow(req: Request, res: IMCResponse, next: NextFunction) {
    if (!database.db) {
      return catchMiddleware(next)(new HttpException(500, 'No database'))
    } else {
      return database.db(req.body.table).where('id', req.body.id).update(req.body.data).then(
        addToResponse(res, 'results')
      ).then(
        nextAndReturn(next)
      )
    }
  }

  public deleteRow(req: Request, res: IMCResponse, next: NextFunction) {
    if (!database.db) {
      return catchMiddleware(next)(new HttpException(500, 'No database'))
    } else {
      return database.db(req.params.table).where('id', req.params.id).del().then(
        addToResponse(res, 'results')
      ).then(
        nextAndReturn(next)
      )
    }
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

    const requestedColumns = filterTableColumns(TABLE_CONFIG, 'detail')
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
