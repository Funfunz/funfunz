import knex from 'knex'
import config from '@root/api/utils/configLoader'
import Debug from 'debug'

const debug = Debug('funfunzmc:database')

class Database {
  db: knex | null
  constructor () {
    this.db = null
  }
  initDB () {
    const configuration = config().config
    if (configuration.mysql) {
      this.db = knex({
        client: 'mysql2',
        connection: {
          host : configuration.mysql.host,
          user : configuration.mysql.user,
          password : configuration.mysql.password,
          database : configuration.mysql.database
        }
      })
    }

    // creates a new sequelize instance
    const {
      DB_NAME,
      DB_USER,
      DB_PASSWORD,
      DB_HOST,
      DB_DIALECT,
      DB_LOG,
      // DB_INSTANCE,
    } = process.env
    debug('Start')
    debug('DB_NAME', DB_NAME)
    debug('DB_USER', DB_USER)
    debug('DB_PASSWORD', DB_PASSWORD)
    debug('DB_HOST', DB_HOST)
    debug('DB_DIALECT', DB_DIALECT)
    
    debug('End')
  }
}

const database = new Database()

export default database
