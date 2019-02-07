// get the client
import mysql from 'mysql2'

const DB = 'splitbills'

// create the connection to database
function createConnection() {
  return mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'BlueInfinity1!',
    database: DB
  })
}
 
// simple query

const tables: Promise<Array<string>> = new Promise<any>(
  (res, rej) => {
    const connection = createConnection()
    connection.execute(
      'show tables',
      (err, results: Array<mysql.RowDataPacket>) => {
        if (err) {
          rej(err)
        }
        const tables: Array<string> = results.map(result => result[`Tables_in_${DB}`])
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



export default tables