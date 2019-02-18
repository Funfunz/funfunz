import { describeInfo, schemaInfo } from '@root/describeTable'
import { ITypeAnswers } from '@root/index'
import fs from 'fs'

interface ITableInfo {
  name: string,
  pk: string,
  columns: IColumnInfo[],
  visible: boolean
}

interface IColumnInfo {
  name: string,
  verbose: string,
  type: string,
  allowNull: boolean,
  visible: {
    main: boolean,
    detail: boolean
  },
  editable: boolean,
  relation?: {
    type: string,
    table: string,
    key: string,
    display: string[]
  }
}

function buildTableInfo(): ITableInfo {
  return {
    name: '',
    pk: '',
    columns: [],
    visible: true,
  }
}

function buildColumnInfo(): IColumnInfo {
  return {
    name: '',
    verbose: '',
    type: '',
    allowNull: true,
    visible: {
      main: true,
      detail: true,
    },
    editable: true,
  }
}

export function generateSettings(DBData: Array<{schema: schemaInfo, describe: describeInfo}>): any {
  const resultData: any[] = []
  DBData.forEach(
    (tableData) => {
      const table = buildTableInfo()
      const schema = tableData.schema
      const describe = tableData.describe

      table.name = schema[0].TABLE_NAME
      describe.forEach(
        (column) => {
          const columnData = buildColumnInfo()
          columnData.name = column.Field
          columnData.verbose = column.Field
          columnData.type = column.Type
          columnData.allowNull = column.Null === 'NO' ? false : true

          if (column.Key === 'PRI') {
            table.pk = column.Field
          }
          tableData.schema.forEach(
            (schemaData) => {
              if (schemaData.COLUMN_NAME === column.Field) {
                columnData.relation = {
                  type: 'oneToMany',
                  table: schemaData.REFERENCED_TABLE_NAME || '',
                  key: schemaData.REFERENCED_COLUMN_NAME || '',
                  display: [
                    schemaData.REFERENCED_COLUMN_NAME || '',
                  ],
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

export function generateConfig(answers: ITypeAnswers) {
  const finalConfig = {
    [answers.DBType]: {
        host: answers.DBHost,
        database: answers.DBName,
        user: answers.DBUser,
        password: answers.DBPassword,
    },
    server: {
        port: 3004,
    },
  }
  fs.writeFile('config.json', JSON.stringify(finalConfig, null, 2), 'utf8', (err) => {
    if (err) {
      console.log('err', err)
    }
  })
}
