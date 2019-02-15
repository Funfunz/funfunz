#!/usr/bin/env node

/**
 * Module dependencies.
 */

import dotenv from 'dotenv'
import App from '@root/api/app'
// import database from 'db'
import Debug from 'debug'

// boot
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

  return app.server
}
