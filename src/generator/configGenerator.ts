import { describeInfo, IPropertyInfo, IConfig, ISettings, IEntityInfo, schemaInfo } from './configurationTypes'
import Debug from 'debug'
import fs from 'fs'
import path from 'path'
import pluralize from 'pluralize'

const debug = Debug('funfunz:config-generator')

const INPUT_TYPES: {
  [key: string]: 'text' | 'checkbox' | 'number' | 'date'
} = {
  'string': 'text',
  'boolean': 'checkbox',
  'number': 'number',
}

function buildTableInfo(): IEntityInfo & { layout: Record<string, unknown> } {
  return {
    name: '',
    connector: 'mysql',
    visible: true,
    properties: [],
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

function buildColumnInfo(): IPropertyInfo & { layout : {editField : Record<string, unknown>}}{
  return {
    name: '',
    model: {
      type: 'string',
      allowNull: true,
    },
    layout: {
      label: '',
      listColumn: true,
      editField: {},
    },
  }
}

export function generateSettings(
  DBData: Array<{ schema: schemaInfo, describe: describeInfo }>,
  selectedPath: string
): void {
  const resultData: ISettings = []
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
          if (column.Key === 'PRI') {
            columnData.model.isPk = true
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
          table.properties.push(columnData)
        }
      )

      fs.writeFile(
        path.join(selectedPath, '/models/' + table.name + '.ts'),
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
    path.join(selectedPath, '/MCsettings.ts'),
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

export function generateConfig(answers: Record<string, string>, selectedPath: string): void {
  const finalConfig: IConfig = {
    connectors: {
      [answers.DBType]: {
        type: answers.DBType as 'sql',
        config: {
          host: answers.DBHost,
          database: answers.DBName,
          user: answers.DBUser || '',
          password: answers.DBPassword || '',
          port: answers.DBPort || '',
        }
      }
    }
  }

  if (answers.DBAuthSorce) {
    finalConfig[answers.DBType].authSource = answers.DBAuthSorce
  }

  if (answers.DBAuthMechanism) {
    finalConfig[answers.DBType].authMechanism = answers.DBAuthMechanism
  }

  fs.mkdirSync(selectedPath)
  fs.writeFile(
    path.join(selectedPath, 'MCconfig.ts'),
    'export default ' + JSON.stringify(finalConfig, null, 2),
    'utf8',
    (err) => {
      if (err) {
        debug('err' + JSON.stringify(err))
      }
    }
  )
}
