import { describeInfo, IProperty, IConfig, IEntityInfo, schemaInfo } from './configurationTypes.js'
import Debug from 'debug'
import fs from 'fs'
import path from 'path'

const debug = Debug('funfunz:config-generator')

function buildTableInfo(): IEntityInfo {
  return {
    name: '',
    connector: 'mysql',
    visible: true,
    properties: [],
  }
}

function buildColumnInfo(): IProperty {
  return {
    name: '',
    type: 'string',
  }
}

export function generateSettings(
  DBData: Array<{ schema: schemaInfo, describe: describeInfo }>,
  selectedPath: string
): void {
  const resultData: IEntityInfo[] = []
  fs.mkdirSync(path.join(selectedPath, '/models/'))
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
          columnData.type = column.Type.indexOf('var') === 0
            ? 'string'
            : column.Type.indexOf('tinyint') === 0
              ? 'boolean'
              : column.Type.indexOf('int') > 0
                ? 'number'
                : 'string'
          columnData.required = column.Null === 'NO' ? true : false
          if (column.Key === 'PRI') {
            columnData.isPk = true
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
                  remoteEntity: schemaData.REFERENCED_TABLE_NAME || '',
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
        connector: '' as never,
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
