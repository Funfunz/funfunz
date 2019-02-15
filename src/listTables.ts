// get the client
import mysql from 'mysql2'
import { typeAnswers } from '@root/index'

// create the connection to database
function createConnection() {
  return mysql.createConnection({
    host: process.env.DBHost,
    user: process.env.DBUser,
    password: process.env.DBPassword,
    database: process.env.DBName
  })
}
 
// simple query

const tables = (): Promise<Array<string>> => {
  return new Promise<any>(
    (res, rej) => {
      const connection = createConnection()
      connection.execute(
        'show tables',
        (err, results: Array<mysql.RowDataPacket>) => {
          if (err) {
            rej(err)
          }
          const tables: Array<string> = results.map(result => result[`Tables_in_${process.env.DBName}`])
          res({connection, tables})
        }
      )
    }
  ).then(
    (result) => {
      result.connection.end()
      return result.tables
    }
  ).catch(
    err => {
      throw err
    }
  )
}



export default tables