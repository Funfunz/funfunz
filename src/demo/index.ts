import { Funfunz } from '../middleware'
import config from './configs/MCconfig'
import settings from './configs/MCsettings'
import httpServer from './httpServer'

if (process.env.JAWSDB_URL) {
  console.log('JAWSDB_URL', process.env.JAWSDB_URL)
  const DB_URL = process.env.JAWSDB_URL
  const userAndPass = DB_URL.split('@')[0].split('mysql://')[1]
  const [user, password] = userAndPass.split(':')
  const [hostname, database] = DB_URL.split('@')[1].split('/')
  const [host, port = '3306'] = hostname.split(':')
  config.connectors.mainDatabase.config = {
    client: 'mysql2',
    host,
    database: database.split('?')[0],
    user,
    password,
    port
  }
  console.log('mysql config', config.connectors.mainDatabase.config)
}

const funfunz = new Funfunz({
  config,
  settings,
})

/**
 * Create HTTP server if not loaded has a plugin.
 */

httpServer(funfunz.middleware)
