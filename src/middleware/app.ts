import database from './db'
import IndexRouter from './routes'
import { errorHandler } from './utils'
import cors from 'cors'
import Debug from 'debug'
import express from 'express'
import logger from 'morgan'

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

    this.server.use(errorHandler)
    debug('funfunz ready')
  }
}

export default App
