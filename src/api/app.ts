import database from '@root/api/db'
import IndexRouter from '@root/api/routes'
// import fileUpload from 'express-fileupload'
import { HttpException } from '@root/api/types'
import { errorHandler } from '@root/api/utils'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import Debug from 'debug'
import express from 'express'
// import favicon from 'serve-favicon'
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

    this.server.use(cors())

    // view ngine setup
    this.server.set('views', path.join(__dirname, 'views'))
    this.server.set('view engine', 'jade')

    // uncomment after placing your favicon in /public
    // app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    this.server.use(logger('dev'))
    this.server.use(express.json())
    this.server.use(express.urlencoded())
    // this.server.use(fileUpload())
    this.server.use(cookieParser())
    this.server.use(express.static(path.join(__dirname, '../public')))

    const indexRouter = new IndexRouter()
    this.server.use('/', indexRouter.getRouter())

    // catch 404 and forward to error handler
    this.server.use(
      (req, res, next) => {
        const err = new HttpException(404, 'Not Found')
        err.status = 404
        next(err)
      }
    )

    this.server.use(errorHandler)
    debug('end')
  }
}

export default App
