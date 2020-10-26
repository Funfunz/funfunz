import { describeInfo, IColumnInfo, ITableInfo, schemaInfo } from './configurationTypes'
import Debug from 'debug'
import fs from 'fs'
import path from 'path'
import pluralize from 'pluralize'

const debug = Debug('funfunz:config-generator')

const INPUT_TYPES: {
  [key: string]: 'text' | 'checkbox' | 'number' | 'date'
} = {
  'varchar(255)': 'text',
  'tinyint(1)': 'checkbox',
  'int(11)': 'number',
  'int': 'number',
  'datetime': 'date',
  'text': 'text',
}

function buildTableInfo(): ITableInfo {
  return {
    name: '',
    visible: true,
    roles: {
      create: ['all'],
      read: ['all'],
      update: ['all'],
      delete: ['all'],
    },
    columns: [],
    layout: {
      label: '',
      listPage: true,
      searchField: true,
      createButton: true,
      editButton: true,
      deleteButton: true,
      editPage: {
        sections: [],
      },
    },
  }
}

function buildColumnInfo(): IColumnInfo {
  return {
    name: '',
    searchable: true,
    visible: {
      list: true,
      detail: true,
      relation: false,
    },
    model: {
      type: 'varchar(255)',
      allowNull: true,
    },
    layout: {
      label: '',
      listColumn: true,
      editField: {},
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

      table.layout.label = pluralName.charAt(0).toUpperCase() + pluralName.slice(1)
      describe.forEach(
        (column) => {
          const columnData = buildColumnInfo()
          columnData.name = column.Field
          columnData.layout.label = column.Field.charAt(0).toUpperCase() + column.Field.substring(1)
          columnData.model.type = column.Type
          columnData.layout.editField.type = INPUT_TYPES[column.Type]
          columnData.model.allowNull = column.Null === 'NO' ? false : true
          columnData.visible.detail = isEditable(column.Field)
          if (column.Key === 'PRI') {
            columnData.model.isPk = true
            columnData.visible.relation = true
          }
          tableData.schema.forEach(
            (schemaData) => {
              if (schemaData.COLUMN_NAME === column.Field) {
                if (!table.relations) {
                  table.relations = []
                }
                table.relations.push({
                  type: 'n:1',
                  foreignKey: columnData.name,
                  remoteTable: schemaData.REFERENCED_TABLE_NAME || '',
                })
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
