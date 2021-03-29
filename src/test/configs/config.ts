import { IConfig } from '../../generator/configurationTypes'
import { Connector } from '@funfunz/sql-data-connector'
const config: IConfig = {
  connectors: {
    mainDatabase: {
      // @ts-ignore
      connector: Connector,
      config: {
        client: 'mysql2',
        host: process.env.DB_HOST || '127.0.0.1',
        database: process.env.DB_NAME || 'test_db',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || 'password',
        port: process.env.DB_PORT || '3306'
      },
    }
  }
}
export default config