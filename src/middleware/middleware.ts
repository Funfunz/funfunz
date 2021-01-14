import { initDataConnectors } from './dataConnector/index'
import IndexRouter from './routes/index'
import Debug from 'debug'
import express, { Response, Request } from 'express'
import logger from 'morgan'
import { HttpException } from './utils/exception'
import { Funfunz } from './index'

const debug = Debug('funfunz:init')

/** Class representing the express server instance. */
export class ExpressMiddleware {
  /**
   * Create an express server instance.
   */

  public express: express.Express
  constructor(funfunz: Funfunz) {
    debug('starting express middleware')
    initDataConnectors(funfunz)
    this.express = express()
    this.express.disable('x-powered-by')

    this.express.use(logger('dev'))

    const indexRouter = new IndexRouter(funfunz)
    this.express.use('/', indexRouter.getRouter())

    this.express.use((err: HttpException, req: Request, res: Response) => {
      res.status(err.status || 500)
      if (process.env.NODE_ENV !== 'developement' && process.env.NODE_ENV !== 'test') {
        res.send('Error')
      } else {
        res.json({
          message: err.message,
        })
      }
    })
    debug('express middleware ready')
  }
}
