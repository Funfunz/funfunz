import { describeInfo, IColumnInfo, ITableInfo, schemaInfo } from '@root/generator/configurationTypes'
import Debug from 'debug'
import fs from 'fs'
import path from 'path'
import pluralize from 'pluralize'

const debug = Debug('funfunzmc:config-generator')

const INPUT_TYPES: {
  [key: string]: 'text' | 'checkbox' | 'number' | 'date'
} = {
  'varchar(255)': 'text',
  'tinyint(1)': 'checkbox',
  'int(11)': 'number',
  'datetime': 'date',
  'text': 'text',
}

function buildTableInfo(): ITableInfo {
  return {
    name: '',
    verbose: '',
    pk: [],
    actions: {
      delete: true,
      edit: true,
    },
    columns: [],
    visible: true,
    roles: {
      read: ['all'],
      write: ['all'],
      delete: ['all'],
    },
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
    input: {
      type: 'text',
    },
  }
}

function isEditable(fieldName: string) {
  switch (fieldName) {
    case 'createdAt':
    case 'updatedAt':
      return false
  }
  return true
}

export function generateSettings(
  DBData: Array<{ schema: schemaInfo, describe: describeInfo }>,
  selectedPath: string
): any {
  const resultData: any[] = []
  fs.mkdirSync(path.join(selectedPath, '/models/'))
  DBData.forEach(
    (tableData) => {
      const table = buildTableInfo()
      const schema = tableData.schema
      const describe = tableData.describe
      table.name = schema[0].TABLE_NAME

      const pluralName = pluralize(table.name)

      table.verbose = pluralName.charAt(0).toUpperCase() + pluralName.slice(1)
      describe.forEach(
        (column) => {
          const columnData = buildColumnInfo()
          columnData.name = column.Field
          columnData.verbose = column.Field
          columnData.type = column.Type
          columnData.input.type = INPUT_TYPES[column.Type]
          columnData.allowNull = column.Null === 'NO' ? false : true
          columnData.editable = isEditable(column.Field)
          if (column.Key === 'PRI') {
            table.pk.push(column.Field)
          }
          tableData.schema.forEach(
            (schemaData) => {
              if (schemaData.COLUMN_NAME === column.Field) {
                columnData.relation = {
                  type: 'oneToMany',
                  table: schemaData.REFERENCED_TABLE_NAME || '',
                  key: schemaData.REFERENCED_COLUMN_NAME || '',
                  display: schemaData.REFERENCED_COLUMN_NAME || '',
                }
              }
            }
          )

          table.columns.push(columnData)
        }
      )

      fs.writeFile(
        path.join(selectedPath, '/models/' + table.name + '.js'),
        'export default ' + JSON.stringify(table, null, 2),
        'utf8',
        (err) => {
          if (err) {
            debug('err' + JSON.stringify(err))
          }
        }
      )
      resultData.push(table)
    }
  )

  fs.writeFile(
    path.join(selectedPath, '/MCsettings.js'),
    resultData.map(
      (table) => `import ${table.name}Model from './models/${table.name}'\n`
    ).join('') +
    '\nexport default [\n' +
    resultData.map(
      (table) => `  ${table.name}Model,\n`
    ).join('') +
    ']\n',
    'utf8',
    (err) => {
      if (err) {
        debug('err' + JSON.stringify(err))
      }
    }
  )
}

export function generateConfig(answers: any, selectedPath: string) {
  const finalConfig: any = {
    [answers.DBType]: {
        host: answers.DBHost,
        database: answers.DBName,
        user: answers.DBUser || '',
        password: answers.DBPassword || '',
        port: answers.DBPort || '',
    },
    server: {
        port: 3004,
    },
  }

  if (answers.DBAuthSorce) {
    finalConfig[answers.DBType].authSource = answers.DBAuthSorce
  }

  if (answers.DBAuthMechanism) {
    finalConfig[answers.DBType].authMechanism = answers.DBAuthMechanism
  }

  fs.mkdirSync(selectedPath)
  fs.writeFile(
    path.join(selectedPath, 'MCconfig.js'),
    'export default ' + JSON.stringify(finalConfig, null, 2),
    'utf8',
    (err) => {
      if (err) {
        debug('err' + JSON.stringify(err))
      }
    }
  )
}
