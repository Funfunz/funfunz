import config from '@root/api/utils/configLoader'
import Debug from 'debug'
import knex from 'knex'

const debug = Debug('funfunzmc:database')

class Database {
  public db: knex | null
  constructor() {
    this.db = null
  }
  public initDB() {
    const configuration = config().config
    if (configuration.mysql) {
      this.db = knex({
        client: 'mysql2',
        connection: {
          host : configuration.mysql.host,
          user : configuration.mysql.user,
          password : configuration.mysql.password,
          database : configuration.mysql.database,
        },
      })
    }

    // creates a new sequelize instance
    const {
      databaseName,
      user,
      password,
      host,
      dialect = 'mysql2',
      log,
    } = configuration.mysql
    debug('Start')
    debug('DB_NAME', databaseName)
    debug('DB_USER', user)
    debug('DB_PASSWORD', password)
    debug('DB_HOST', host)
    debug('DB_DIALECT', dialect)
    debug('log', log)
    debug('End')
  }
}

const database = new Database()

export default database
