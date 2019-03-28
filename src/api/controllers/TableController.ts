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
import { ITableInfo } from '@root/configGenerator'
import Bluebird from 'bluebird'
import Debug from 'debug'
import { NextFunction, Request } from 'express'

const debug = Debug('funfunzmc:controller-table')

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

    if (hasAuthorization(TABLE_CONFIG.roles, userRoles)) {
      addToResponse(res, 'results')(TABLE_CONFIG.columns)
      return nextAndReturn(next)(TABLE_CONFIG.columns)
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
        return database.db.select(COLUMNS).from(TABLE_NAME).offset((PAGE_NUMBER || 0) * LIMIT).limit(LIMIT).then(
          (results) => {
            runHook(TABLE_CONFIG, 'getTableData', 'after', req, res, database.db, results).then(
              addToResponse(res, 'results')
            ).then(
              nextAndReturn(next)
            )
          }
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
