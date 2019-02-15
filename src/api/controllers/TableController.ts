import Debug from 'debug'
import { MCResponse, HttpException } from '@root/api/types';
import { NextFunction, Request } from 'express';
import { catchMiddleware, addToResponse, nextAndReturn } from '@root/api/utils'
import config from '@root/api/utils/configLoader'
import database from '@root/api/db/index'

const debug = Debug('funfunzmc:controller-table')

class TableController {
  settings: Array<any>
  constructor () {
    debug('Created')
    this.settings = config().settings
  }

  getTableData(req: Request, res: MCResponse, next: NextFunction) {
    if (database.db) {
      database.db.select('*').from(req.params.table).offset((req.query.page || 0) * 10).limit(10).then(
        results => {
          addToResponse(res, results, 'results')
          return nextAndReturn(next)(results)
        }
      )
    } else {
      catchMiddleware(next)(new HttpException(500, 'No database'))
    }
  }

  insertRow(req: Request, res: MCResponse, next: NextFunction) {
    if (database.db) {
      database.db(req.params.table).insert(req.body.data).then(
        results => {
          addToResponse(res, results, 'results')
          return nextAndReturn(next)(results)
        }
      )
    } else {
      catchMiddleware(next)(new HttpException(500, 'No database'))
    }
  }

  updateRow(req: Request, res: MCResponse, next: NextFunction) {
    if (database.db) {
      database.db(req.body.table).where('id', req.body.id).update(req.body.data).then(
        results => {
          addToResponse(res, results, 'results')
          return nextAndReturn(next)(results)
        }
      )
    } else {
      catchMiddleware(next)(new HttpException(500, 'No database'))
    }
  }

  deleteRow(req: Request, res: MCResponse, next: NextFunction) {
    if (database.db) {
      database.db(req.params.table).where('id', req.params.id).del().then(
        results => {
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
