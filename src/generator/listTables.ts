// get the client
import mysql from 'mysql2'

// create the connection to database
function createConnection() {
  return mysql.createConnection({
    host: process.env.DBHost,
    user: process.env.DBUser,
    password: process.env.DBPassword,
    database: process.env.DBName,
  })
}

const getTableList = (): Promise<string[]> => {
  return new Promise<any>(
    (res, rej) => {
      const connection = createConnection()
      connection.execute(
        'show tables',
        (err, results: mysql.RowDataPacket[]) => {
          if (err) {
            rej(err)
          }
          const tablesList: string[] = results.map((result) => result[`Tables_in_${process.env.DBName}`])
          res({connection, tables: tablesList})
        }
      )
    }
  ).then(
    (result) => {
      result.connection.end()
      return result.tables
    }
  ).catch(
    (err) => {
      throw err
    }
  )
}

export default getTableList
