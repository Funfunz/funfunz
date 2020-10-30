import config from '../utils/configLoader'
import Debug from 'debug'
import knex from 'knex'

const debug = Debug('funfunz:database-knex')

class Database {
  public db: knex | null
  constructor() {
    this.db = null
  }
  public initDBconnection(): void {
    const configuration = config().config
    if (configuration.mysql) {
      this.db = knex({
        client: 'mysql2',
        connection: {
          dateStrings: true,
          ...configuration.mysql,
        },
      })
    }

    // creates a new sequelize instance
    const {
      database,
      user,
      password,
      host,
      port,
      dialect = 'mysql2',
      log,
    } = configuration.mysql
    debug('Start')
    debug('DB_NAME', database)
    debug('DB_USER', user)
    debug('DB_PASSWORD', password)
    debug('DB_HOST', host)
    debug('DB_PORT', port)
    debug('DB_DIALECT', dialect)
    debug('log', log)
    debug('End')
  }
}

const database = new Database()

export default database

export {
  Database
}
