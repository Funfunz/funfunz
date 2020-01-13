// get the client
import { describeInfo, IDatabaseData, schemaInfo } from '@root/generator/configurationTypes'
import mysql from 'mysql2'

// create the connection to database
function createPoolSchema() {
  return mysql.createPool({
    host: process.env.DBHost,
    user: process.env.DBUser,
    password: process.env.DBPassword,
    database: 'INFORMATION_SCHEMA',
    waitForConnections: true,
    connectionLimit: 40,
    queueLimit: 0,
  })
}

function createPoolDB() {
  return mysql.createPool({
    host: process.env.DBHost,
    user: process.env.DBUser,
    password: process.env.DBPassword,
    database: process.env.DBName,
    waitForConnections: true,
    connectionLimit: 40,
    queueLimit: 0,
  })
}

const describe = (tablesNames: string[]): Promise<IDatabaseData[]> => {
  const poolSchema = createPoolSchema()
  const poolDescribeDB = createPoolDB()

  const promises: Array<Promise<IDatabaseData>> = tablesNames.map(
    (tableName) => {
      return new Promise<IDatabaseData>(
        (res, rej) => {
          let counter = 0
          const results: IDatabaseData = {
            schema: [],
            describe: [],
          }
          function callback() {
            counter += 1
            if (counter === 2) {
              res(results)
            }
          }
          poolSchema.execute(
            'SELECT ' +
            'TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME ' +
            'FROM KEY_COLUMN_USAGE ' +
            'WHERE ' +
              'TABLE_SCHEMA=\'' + process.env.DBName + '\' ' +
              'AND ' +
              'TABLE_NAME=\'' + tableName + '\' ' +
              'AND ' +
              'REFERENCED_COLUMN_NAME IS NOT NULL' +
            ';',
            (err, schema: schemaInfo) => {
              if (err) {
                rej(err)
              }
              if (!schema || schema.length === 0) {
                schema = [{TABLE_NAME: tableName}]
              } else {
                schema = schema.map(
                  (schemaItem) => ({
                    ...schemaItem,
                    TABLE_NAME: tableName,
                  })
                )
              }
              results.schema = schema
              callback()
            }
          )
          poolDescribeDB.execute(
            `describe \`${tableName}\``,
            (err, describeData: describeInfo) => {
              if (err) {
                rej(err)
              }
              results.describe = describeData
              callback()
            }
          )
        }
      )
    }
  )
  return Promise.all(promises).then(
    (result) => {
      poolSchema.end()
      poolDescribeDB.end()
      return result
    }
  )
}

// create the connection to database
function createConnection() {
  return mysql.createConnection({
    host: process.env.DBHost,
    user: process.env.DBUser,
    password: process.env.DBPassword,
    database: process.env.DBName,
  })
}

const getDatabaseData = (): PromiseLike<IDatabaseData[]> => {
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
      return describe(result.tables)
    }
  )
}

export default getDatabaseData
