import { IConfig } from "../../generator/configurationTypes"

const config: IConfig = {
  connectors: {
    mainDatabase: {
      type: "sql",
      config: {
        client: 'mysql2',
        host: "127.0.0.1",
        database: "test_db",
        user: "root",
        password: process.env.DB_PASSWORD || '',
        port: "3306"
      },
    },
  },
  server: {
    port: 3004
  }
}
export default config