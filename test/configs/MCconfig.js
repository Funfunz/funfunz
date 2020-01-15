/* istanbul ignore file */
export default {
  "mysql": {
    "host": "localhost",
    "database": "test_db",
    "user": "root",
    "port": "3306",
    "password": process.env.DB_PASSWORD || ""
  },
  "server": {
    "port": process.env.PORT || 3004
  }
}