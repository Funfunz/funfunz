// get the client
import mysql from 'mysql2'

export type describeInfo = Array<{
  Field: string,
  Type: string,
  Null: string,
  Key: string,
  Default: string | number | null,
  Extra: string
}>

export type schemaInfo = Array<{
  TABLE_NAME: string,
  COLUMN_NAME?: string,
  CONSTRAINT_NAME?: string,
  REFERENCED_TABLE_NAME?: string,
  REFERENCED_COLUMN_NAME?: string,
}>

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

const describe = (tablesNames: string[]): PromiseLike<Array<{schema: schemaInfo, describe: describeInfo}>> => {
  const poolSchema = createPoolSchema()
  const poolDB = createPoolDB()

  const promises: Array<Promise<{schema: schemaInfo, describe: describeInfo}>> = tablesNames.map(
    (tableName) => {
      return new Promise<{schema: schemaInfo, describe: describeInfo}>(
        (res, rej) => {
          let counter = 0
          const results: {
            schema: schemaInfo,
            describe: describeInfo
          } = {
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
              }
              results.schema = schema
              callback()
            }
          )
          poolDB.execute(
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
    (result: Array<{schema: schemaInfo, describe: describeInfo}>) => {
      poolSchema.end()
      poolDB.end()
      return result
    }
  ).catch(
    (err) => {
      throw err
    }
  )
}

export default describe
