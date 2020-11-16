import { IConfig } from "../../generator/configurationTypes"

const config: IConfig = {
  connectors: {
    mainDatabase: {
      type: "sql",
      config: {
        client: 'mysql2',
        host: process.env.DB_HOST || "127.0.0.1",
        database: process.env.DB_NAME || "test_db",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASS || '',
        port: "3306"
      },
    },
  },
  server: {
    port: 3004
  }
}
export default config