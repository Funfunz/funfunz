import database from '@root/api/db'
import { HttpException, IMCRequest, IMCResponse } from '@root/api/types';
import { addToResponse, buildError, catchMiddleware, hasAuthorization, nextAndReturn } from '@root/api/utils'
import config from '@root/api/utils/configLoader'
import { ITableInfo } from '@root/configGenerator'
import Bluebird from 'bluebird'
import Debug from 'debug'
import { NextFunction, Request } from 'express'

const debug = Debug('funfunzmc:controller-table')

class TableController {
  public settings: ITableInfo[]
  constructor() {
    debug('Created')
    this.settings = config().settings
  }

  public getTableConfig(req: IMCRequest, res: IMCResponse, next: NextFunction) {
    if (!this.settings || this.settings.length === 0) {
      throw buildError('Table not found', 404)
    } else {
      let userRoles: string[] = []
      if (req.user && req.user.roles) {
        userRoles = req.user.roles
      }

      const table = this.settings.filter(
        (tableItem) => tableItem.name === req.params.table
      )[0]

      if (hasAuthorization(table.roles, userRoles)) {
        addToResponse(res, table.columns, 'results')
        return nextAndReturn(next)(table.columns)
      } else {
        return catchMiddleware(next)(new HttpException(401, 'Not authorized'))
      }
    }
  }

  public getTableData(req: IMCRequest, res: IMCResponse, next: NextFunction) {
    if (!this.settings || this.settings.length === 0) {
      throw buildError('Table not found', 404)
    }

    const table = this.settings.filter(
      (tableItem) => tableItem.name === req.params.table
    )[0]

    let userRoles: string[] = []
    if (req.user && req.user.roles) {
      userRoles = req.user.roles
    }

    if (!hasAuthorization(table.roles, userRoles)) {
      return catchMiddleware(next)(new HttpException(401, 'Not authorized'))
    } else {
      if (!database.db) {
        return catchMiddleware(next)(new HttpException(500, 'No database'))
      } else {
        return database.db.select('*').from(req.params.table).offset((req.query.page || 0) * 10).limit(10).then(
          (results) => {
            if (table.hooks && table.hooks.getTableData && table.hooks.getTableData.after) {
              if (database.db) {
                return table.hooks.getTableData.after(req, res, database.db, table.name, results).then(
                  (resultsBeforeGet) => {
                    addToResponse(res, resultsBeforeGet, 'results')
                    return nextAndReturn(next)(resultsBeforeGet)
                  }
                )
              }
            } else {
              addToResponse(res, results, 'results')
              return nextAndReturn(next)(results)
            }
          }
        )
      }
    }
  }

  public getTableCount(req: IMCRequest, res: IMCResponse, next: NextFunction) {
    if (!this.settings || this.settings.length === 0) {
      throw buildError('Table not found', 404)
    }

    const table = this.settings.filter(
      (tableItem) => tableItem.name === req.params.table
    )[0]

    let userRoles: string[] = []
    if (req.user && req.user.roles) {
      userRoles = req.user.roles
    }

    if (!hasAuthorization(table.roles, userRoles)) {
      return catchMiddleware(next)(new HttpException(401, 'Not authorized'))
    } else {
      if (!database.db) {
        return catchMiddleware(next)(new HttpException(500, 'No database'))
      } else {
        return database.db.select('*').from(req.params.table).then(
          (results) => {
            if (table.hooks && table.hooks.getTableCount && table.hooks.getTableCount.after) {
              if (database.db) {
                return table.hooks.getTableCount.after(req, res, database.db, table.name, results).then(
                  (count) => {
                    addToResponse(res, count, 'count')
                    return nextAndReturn(next)(count)
                  }
                )
              }
            } else {
              addToResponse(res, results.length, 'count')
              return nextAndReturn(next)(results)
            }
          }
        )
      }
    }
  }

  public getRow(req: IMCRequest, res: IMCResponse, next: NextFunction) {
    if (!this.settings || this.settings.length === 0) {
      throw buildError('Table not found', 404)
    }

    const table = this.settings.filter(
      (tableItem) => tableItem.name === req.params.table
    )[0]

    let userRoles: string[] = []
    if (req.user && req.user.roles) {
      userRoles = req.user.roles
    }

    if (!hasAuthorization(table.roles, userRoles)) {
      return catchMiddleware(next)(new HttpException(401, 'Not authorized'))
    } else {
      if (!database.db) {
        return catchMiddleware(next)(new HttpException(500, 'No database'))
      } else {
        const requestedColumns = table.columns.filter(
          (column) => column.visible.detail
        ).map(
          (column) => column.name
        )
        return database.db.select(requestedColumns)
          .from(req.params.table)
          .where('id', req.params.id)
        .then(
          (results) => {
            addToResponse(res, results[0], 'result')
            return nextAndReturn(next)(results[0])
          }
        )
      }
    }
  }

  public insertRow(req: Request, res: IMCResponse, next: NextFunction) {
    if (database.db) {
      database.db(req.params.table).insert(req.body.data).then(
        (results) => {
          addToResponse(res, results, 'results')
          return nextAndReturn(next)(results)
        }
      )
    } else {
      catchMiddleware(next)(new HttpException(500, 'No database'))
    }
  }

  public updateRow(req: Request, res: IMCResponse, next: NextFunction) {
    if (database.db) {
      database.db(req.body.table).where('id', req.body.id).update(req.body.data).then(
        (results) => {
          addToResponse(res, results, 'results')
          return nextAndReturn(next)(results)
        }
      )
    } else {
      catchMiddleware(next)(new HttpException(500, 'No database'))
    }
  }

  public deleteRow(req: Request, res: IMCResponse, next: NextFunction) {
    if (database.db) {
      database.db(req.params.table).where('id', req.params.id).del().then(
        (results) => {
          addToResponse(res, results, 'results')
          return nextAndReturn(next)(results)
        }
      )
    } else {
      catchMiddleware(next)(new HttpException(500, 'No database'))
    }
  }
}

export default TableController
