import { describeInfo, schemaInfo } from '@root/generator/describeTable'
import { ITypeAnswers } from '@root/generator/index'
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

export type Hooks = 'getTableData'
  | 'getDistinctTableData'
  | 'getTableCount'
  | 'getRow'
  | 'insertRow'
  | 'updateRow'
  | 'deleteRow'

export interface IManyToOneRelation {
  fk: string,
  target: string,
}

export interface ITableInfo {
  name: string,
  relations?: ITableRelation[],
  roles: {
    create: string[],
    read: string[],
    write: string[],
    delete: string[],
  },
  columns: IColumnInfo[],
  hooks?: {
    [key in Hooks]?: {
      before?: IHookFunction,
      after?: IHookFunction,
    }
  },
  layout?: any,
}

export interface ITableRelation {
  type: '1:n' | 'n:1' | 'm:n',
  relationalTable: string,
  foreignKey: string,
  remoteForeignKey: string,
  remoteTable: string,
}

export interface IColumnRelation {
  type: '1:n',
  table: string,
  key: string,
  display: string,
}

export interface IColumnInfo {
  name: string,
  searchable: boolean,
  listable: boolean,
  editable: boolean,
  model: {
    isPk?: boolean,
    type: string,
    allowNull: boolean,
  },
  relation?: IColumnRelation,
  layout?: any,
}

function buildTableInfo(): ITableInfo {
  return {
    name: '',
    roles: {
      create: ['all'],
      read: ['all'],
      write: ['all'],
      delete: ['all'],
    },
    columns: [],
    layout: {
      label: '',
      listPage: {},
      searchField: {},
      createButton: {},
      editButton: {},
      deleteButton: {},
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
    listable: true,
    editable: true,
    model: {
      type: '',
      allowNull: true,
    },
    layout: {},
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

const INPUT_TYPES: {
  [key: string]: 'text' | 'checkbox' | 'number' | 'date'
} = {
  'varchar(255)': 'text',
  'tinyint(1)': 'checkbox',
  'int(11)': 'number',
  'datetime': 'date',
}

export function generateSettings(DBData: Array<{schema: schemaInfo, describe: describeInfo}>): any {
  const resultData: any[] = []
  fs.mkdirSync('generatedConfigs/models/')
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
          columnData.layout.label = column.Field
          columnData.model.type = column.Type
          columnData.layout.editField.type = INPUT_TYPES[column.Type]
          columnData.model.allowNull = column.Null === 'NO' ? false : true
          columnData.editable = isEditable(column.Field)
          if (column.Key === 'PRI') {
            columnData.model.isPk = true
          }
          tableData.schema.forEach(
            (schemaData) => {
              if (schemaData.COLUMN_NAME === column.Field) {
                columnData.relation = {
                  type: '1:n',
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

export function generateConfig(answers: ITypeAnswers & { DBType: string }) {
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

  fs.mkdirSync('generatedConfigs/')
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
