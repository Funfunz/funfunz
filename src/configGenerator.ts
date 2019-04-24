import { describeInfo, schemaInfo } from '@root/describeTable'
import { ITypeAnswers } from '@root/index'
import Debug from 'debug'
import express from 'express'
import fs from 'fs'
import knex from 'knex'
import pluralize from 'pluralize'

const debug = Debug('funfunzmc:config-generator')

type IHookFunction = (
  req: express.Request,
  res: express.Response,
  DB: knex,
  tableName: string,
  data?: any
) => Promise <any>

export type Hooks = 'getTableData' | 'getTableCount' | 'getRow' | 'insertRow' | 'updateRow' | 'deleteRow'

export interface ITableInfo {
  name: string,
  verbose: string,
  pk: string | string[],
  actions: {
    delete: boolean,
    edit: boolean,
  },
  searchFields?: string[],
  relations?: {
    manyToOne?: {
      [key: string]: string,
    },
    manyToMany?: [
      {
        verbose: string,
        relationTable: string,
        foreignKey: string,
        localId: string,
        remoteTable: string,
        remoteForeignKey: string,
        remoteId: string,
      }
    ]
  },
  chips?: [
    {
      verbose: string,
      columns: [
        {
          name: string,
          verbose: string,
        }
      ],
    },
  ],
  itemTitle?: string,
  columns: IColumnInfo[],
  visible: boolean,
  roles: string[],
  hooks?: {
    getTableData?: {
      before?: IHookFunction,
      after?: IHookFunction,
    },
    getTableCount?: {
      before?: IHookFunction,
      after?: IHookFunction,
    },
    getRow?: {
      before?: IHookFunction,
      after?: IHookFunction,
    },
    insertRow?: {
      before?: IHookFunction,
      after?: IHookFunction,
    },
    updateRow?: {
      before?: IHookFunction,
      after?: IHookFunction,
    },
    deleteRow?: {
      before?: IHookFunction,
      after?: IHookFunction,
    },
  },
}

export interface IColumnRelation {
  type: string,
  table: string,
  key: string,
  display: string,
}

export interface IColumnInfo {
  name: string,
  verbose: string,
  type: string,
  allowNull: boolean,
  visible: {
    main: boolean,
    detail: boolean,
  },
  editable: boolean,
  relation?: IColumnRelation
}

function buildTableInfo(): ITableInfo {
  return {
    name: '',
    verbose: '',
    pk: '',
    actions: {
      delete: true,
      edit: true,
    },
    columns: [],
    visible: true,
    roles: ['all'],
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

      const pluralName = pluralize(table.name)

      table.verbose = pluralName.charAt(0).toUpperCase() + pluralName.slice(1)
      describe.forEach(
        (column) => {
          const columnData = buildColumnInfo()
          columnData.name = column.Field
          columnData.verbose = column.Field
          columnData.type = column.Type
          columnData.allowNull = column.Null === 'NO' ? false : true

          if (column.Key === 'PRI') {
            if (table.pk !== '' && !Array.isArray(table.pk)) {
              table.pk = [table.pk]
            }

            if (Array.isArray(table.pk)) {
              table.pk.push(column.Field)
            } else {
              table.pk = column.Field
            }
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
        'generatedConfigs/models/' + table.name + '.js',
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
    'generatedConfigs/MCsettings.js',
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
  fs.writeFile(
    'generatedConfigs/MCconfig.js',
    'export default ' + JSON.stringify(finalConfig, null, 2),
    'utf8',
    (err) => {
      if (err) {
        debug('err' + JSON.stringify(err))
      }
    }
  )
}
