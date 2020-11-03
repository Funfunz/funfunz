import database from './db'
import IndexRouter from './routes'
import cors from 'cors'
import Debug from 'debug'
import express, { Response, Request } from 'express'
import logger from 'morgan'
import { HttpException } from './utils/exception'

const debug = Debug('funfunz:init')

/** Class representing the express server instance. */
class App {
  /**
   * Create an express server instance.
   */

  public server: express.Express
  constructor() {
    debug('starting funfunz')
    database.initDBconnection()
    this.server = express()
    this.server.disable('x-powered-by')

    this.server.use([
      cors(),
      logger('dev'),
    ])

    const indexRouter = new IndexRouter()
    this.server.use('/', indexRouter.getRouter())

    this.server.use((err: HttpException, req: Request, res: Response) => {
      res.status(err.status || 500)
      if (process.env.NODE_ENV !== 'developement' && process.env.NODE_ENV !== 'test') {
        res.send('Error')
      } else {
        res.json({
          message: err.message,
        })
      }
    })
    debug('funfunz ready')
  }
}

export default App
