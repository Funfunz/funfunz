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
  visible: boolean,
  relations?: ITableRelation[],
  roles: {
    create: string[],
    read: string[],
    update: string[],
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
  remoteForeignKey?: string,
  remoteTable: string,
}

export interface IColumnRelation {
  type: 'n:1',
  table: string,
  key: string,
}

export interface IColumnInfo {
  name: string,
  searchable: boolean,
  visible: {
    list: boolean,
    detail: boolean,
    relation: boolean,
  },
  model: {
    isPk?: boolean,
    type: 'varchar(255)' | 'tinyint(1)' | 'int(11)' | 'int' | 'datetime'| 'text',
    allowNull: boolean,
  },
  relation?: IColumnRelation,
  layout?: any,
}
