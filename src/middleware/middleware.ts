import { initDataConnectors } from './dataConnector/index.js'
import IndexRouter from './routes/index.js'
import Debug from 'debug'
import express, { Response, Request } from 'express'
import { HttpException } from './utils/exception.js'
import { Funfunz } from './index.js'

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

    const indexRouter = new IndexRouter(funfunz)
    this.express.use(indexRouter.getRouter())

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
