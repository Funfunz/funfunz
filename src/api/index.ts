#!/usr/bin/env node

/**
 * Module dependencies.
 */

import dotenv from 'dotenv'
import App from '@root/api/app'
// import database from 'db'
import Debug from 'debug'
import http from 'http'

// boot
import boot from '@root/api/boot'
import { setConfig } from '@root/api/utils/configLoader';

export default function (configs: any) {
  const debug = Debug('funfunzmc:server')
  dotenv.config()
  
  let params = {
    SERVER_PORT: process.env.MC_PORT,
    NOVE_ENV: process.env.NODE_ENV,
  }

  Object.keys(configs).forEach(
    configKey => {
      setConfig(configs[configKey], configKey)
    }
  )
  
  console.log('---------------------------------------------')
  console.log('INIT PARAMETERS:\n', params)
  console.log('---------------------------------------------')
  
  /**
   * Get port from environment and store in Express.
   */
  
  var app = new App()
  
  var port = normalizePort(process.env.MC_PORT || '3000')
  app.server.set('port', port)
  
  /**
   * Create HTTP server.
   */
  
  const server = http.createServer(app.server)
  
  /**
   * Listen on provided port, on all network interfaces.
   */
  
  /* database.getDB().sync({ force: process.env.NODE_ENV === 'development' }).then(
    () => {
      server.listen(port)
    }
  ) */
  
  server.listen(port)
  
  server.on('error', onError)
  server.on('listening', onListening)
  
  /**
   * Normalize a port into a number, string, or false.
   */
  
  function normalizePort (val: string) {
    const port = parseInt(val, 10)
  
    if (isNaN(port)) {
      // named pipe
      return val
    }
  
    if (port >= 0) {
      // port number
      return port
    }
  
    return false
  }
  
  /**
   * Event listener for HTTP server "error" event.
   */
  
  function onError (error: any) {
    if (error.syscall !== 'listen') {
      throw error
    }
  
    const bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port
  
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges')
        process.exit(1)
      case 'EADDRINUSE':
        console.error(bind + ' is already in use')
        process.exit(1)
      default:
        throw error
    }
  }
  
  /**
   * Event listener for HTTP server "listening" event.
   */
  
  function onListening () {
    const addr = server.address()
    const bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port
    debug('Listening on ' + bind)
    boot()
  }  
}
