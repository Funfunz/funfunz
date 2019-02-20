import database from '@root/api/db/index'
import { HttpException, IMCResponse } from '@root/api/types';
import { addToResponse, catchMiddleware, nextAndReturn } from '@root/api/utils'
import config from '@root/api/utils/configLoader'
import Debug from 'debug'
import { NextFunction, Request } from 'express';

const debug = Debug('funfunzmc:controller-table')

class TableController {
  public settings: any[]
  constructor() {
    debug('Created')
    this.settings = config().settings
  }

  public getTableData(req: Request, res: IMCResponse, next: NextFunction) {
    if (database.db) {
      database.db.select('*').from(req.params.table).offset((req.query.page || 0) * 10).limit(10).then(
        (results) => {
          addToResponse(res, results, 'results')
          return nextAndReturn(next)(results)
        }
      )
    } else {
      catchMiddleware(next)(new HttpException(500, 'No database'))
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
