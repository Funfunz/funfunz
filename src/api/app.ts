import database from '@root/api/db'
import IndexRouter from '@root/api/routes'
import { errorHandler } from '@root/api/utils'
import cors from 'cors'
import Debug from 'debug'
import express from 'express'
import logger from 'morgan'
import path from 'path'

const debug = Debug('funfunzmc:init')

/** Class representing the express server instance. */
class App {
  /**
   * Create an express server instance.
   */

  public server: express.Express
  constructor() {
    debug('start')
    database.initDB()
    this.server = express()
    this.server.disable('x-powered-by')

    this.server.use([
      cors(),
      logger('dev'),
    ])

    this.server.use(/\/((?!graphql).)*/, [
      express.urlencoded({ extended: true }),
      express.json(),
    ])

    this.server.use('/', express.static(path.join(__dirname, './public')))
    const indexRouter = new IndexRouter()
    this.server.use('/', indexRouter.getRouter())

    this.server.use(errorHandler)
    debug('end')
  }
}

export default App
