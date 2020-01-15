import express from 'express'
import knex from 'knex'

type IHookFunction = (
  req: express.Request,
  res: express.Response,
  DB: knex,
  tableName: string,
  data?: any
) => Promise <any>

export interface IDatabaseData {
  schema: schemaInfo,
  describe: describeInfo
}

export type databaseTypes = 'mysql' | 'pgsql' | 'mongoDB'

export interface ITypeAnswers {
  DBHost: string,
  DBName: string,
  DBUser: string,
  DBPassword: string
}

export interface IDescribeItem {
  Field: string,
  Type: string,
  Null: string,
  Key: string,
  Default: string | number | null,
  Extra: string
}

export type describeInfo = IDescribeItem[]

export type schemaInfo = Array<{
  TABLE_NAME: string,
  COLUMN_NAME?: string,
  CONSTRAINT_NAME?: string,
  REFERENCED_TABLE_NAME?: string,
  REFERENCED_COLUMN_NAME?: string,
}>

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
  verbose: string,
  pk: string[],
  order?: number,
  actions: {
    delete: boolean,
    edit: boolean,
  },
  searchFields?: string[],
  relations?: {
    manyToOne?: {
      [key: string]: IManyToOneRelation[],
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
  roles: {
    read: string[],
    write: string[],
    delete: string[],
  },
  hooks?: {
    [key in Hooks]?: {
      before?: IHookFunction,
      after?: IHookFunction,
    }
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
  input: {
    type: 'text' | 'checkbox' | 'date' | 'number',
  },
  relation?: IColumnRelation,
}
