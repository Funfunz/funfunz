export default {
  "mysql": {
    "host": "127.0.0.1",
    "database": "test_db",
    "user": "root",
    "password": process.env.DB_PASSWORD,
    "port": "3306"
  },
  "server": {
    "port": 3004
  }
}