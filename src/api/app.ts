import express from 'express'
import path from 'path'
import cors from 'cors'
// import favicon from 'serve-favicon'
import logger from 'morgan'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
// import fileUpload from 'express-fileupload'
import { HttpException } from '@root/api/types'

import Debug from 'debug'

// routes
import index from '@root/api/routes'

// database
import database from '@root/api/db'
import IndexRouter from '@root/api/routes';

const debug = Debug('cpmbg:setup')

/** Class representing the express server instance. */
class App {
  /**
  * Create an express server instance.
  */

  server: express.Express
  constructor () {
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
    this.server.use(bodyParser.json())
    this.server.use(bodyParser.urlencoded({ extended: false }))
    this.server.use(bodyParser.json())
    this.server.use(bodyParser.urlencoded({ extended: false }))
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

    // error handler
    const erroHandler: express.ErrorRequestHandler = (err, req, res) => {
      res.status(err.status || 500)
      res.json({
        message: err.message,
      })
    }
  
    this.server.use(erroHandler)
    debug('end')
  }
}

export default App
