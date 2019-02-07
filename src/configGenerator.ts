import fs from 'fs'
import { describeInfo, schemaInfo } from '@root/describeTable'

type tableInfo = {
  name: string,
  pk: string,
  columns: Array<
    columnInfo
  >,
}

type columnInfo = {
  name: string,
  verbose: string,
  type: string,
  allowNull: boolean,
  relation?: {
    type: string,
    table: string,
    key: string,
    display: Array<string>
  }
}

function buildTableInfo():tableInfo {
  return {
    name: '',
    pk: '',
    columns: [],
  }
}

function buildColumnInfo():columnInfo {
  return {
    name: '',
    verbose: '',
    type: '',
    allowNull: true,
  }
}

export default function generateConfig(DBData: Array<{schema: schemaInfo, describe: describeInfo}>):any {
  let resultData: Array<any> = []
  DBData.forEach(
    tableData => {
      let table = buildTableInfo()
      const schema = tableData.schema
      const describe = tableData.describe
      console.log(schema)
      table.name = schema[0].TABLE_NAME
      describe.forEach(
        (column) => {
          let columnData = buildColumnInfo()
          columnData.name = column.Field
          columnData.verbose = column.Field
          columnData.type = column.Type
          columnData.allowNull = column.Null === 'NO' ? false : true
          
          if (column.Key === 'PRI') {
            table.pk = column.Field
          }
          tableData.schema.forEach(
            (schema) => {
              if (schema.COLUMN_NAME === column.Field) {
                columnData.relation = {
                  type: 'oneToMany',
                  table: schema.REFERENCED_TABLE_NAME || '',
                  key: schema.REFERENCED_COLUMN_NAME || '',
                  display: [
                    schema.REFERENCED_COLUMN_NAME || ''
                  ]
                }
              }
            }
          )
          
          table.columns.push(columnData)
        }
      )
      resultData.push(table)
    }
  )
  fs.writeFile('settings.json', JSON.stringify(resultData, null, 2), 'utf8', (err) => {
    if (err) {
      console.log('err', err)
    }
  })
}