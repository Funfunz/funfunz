import { OperatorsType } from '../middleware/utils/filter'
import { IDataConnector } from '../types/connector'
import { ITableHooks } from '../types/hooks'

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

export interface IEntityInfo {
  name: string,
  connector: string,
  visible: boolean,
  relations?: IRelation[],
  properties: IPropertyInfo[],
  hooks?: ITableHooks,
  layout?: Record<string, unknown>,
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

export interface IPropertyRelation {
  type: 'n:1',
  table: string,
  key: string,
}

export interface IPropertyInfo {
  name: string,
  filterable?: {
    filters: OperatorsType[]
  } | boolean,
  model: {
    isPk?: boolean,
    type: 'string' | 'number' | 'boolean',
    allowNull: boolean,
  },
  relation?: IPropertyRelation,
  layout?: {
    label: string,
    [key: string]: unknown
  },
}

export interface IConfig {
  connectors: Record<string, IDataConnector>
}

export type ISettings = IEntityInfo[]