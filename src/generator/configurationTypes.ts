import express from 'express'
import knex from 'knex'

type IHookFunction = (
  req: express.Request,
  res: express.Response,
  DB: knex,
  tableName: string,
  data?: unknown
) => Promise<unknown>

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
  Type: 'varchar(255)' | 'tinyint(1)' | 'smallint(5)' | 'int(11)' | 'int' | 'datetime'| 'text',
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

export interface ITableInfo {
  name: string,
  connector: string,
  visible: boolean,
  relations?: IRelation[],
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
  layout: Record<string, unknown>,
}

export interface IRelation1N {
  type: '1:n',
  foreignKey: string,
  remoteTable: string,
}
export interface IRelationN1 {
  type: 'n:1'
  foreignKey: string,
  remoteTable: string,
}
export interface IRelationMN {
  type: 'm:n'
  relationalTable: string,
  foreignKey: string,
  remoteForeignKey: string,
  remoteTable: string,
}
export type IRelation = IRelation1N | IRelationN1 | IRelationMN

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
    type: 'varchar(255)' | 'tinyint(1)' | 'smallint(5)' | 'int(11)' | 'int' | 'datetime'| 'text',
    allowNull: boolean,
  },
  relation?: IColumnRelation,
  layout: {
    label: string,
    [key: string]: unknown
  },
}

export interface IConnector {
    type: 'mysql' | 'pg' | 'redshift',
    config: {
      host: string,
      database: string,
      user: string,
      password: string,
      port: string,
      dialect?: string,
      log?: boolean
    }
}

export interface IConfig {
  server: {
    port: string | number | false
  },
  connectors: Record<string, IConnector>
}

export type ISettings = ITableInfo[]