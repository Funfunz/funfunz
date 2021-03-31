import { OperatorsType } from '../middleware/utils/filter'
import { IDataConnector } from '../types/connector'
import { IHooks } from '../types/hooks'

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
  name: string
  connector: string | {
    name: string
    [key: string]: unknown
  },
  visible: boolean
  relations?: IRelation[]
  properties: IProperty[]
  hooks?: IHooks
  [key: string]: unknown  // aditional settings for plugins (for example: backoffice)
}

export interface IRelation1N {
  type: '1:n'
  foreignKey: string
  remoteEntity: string
}
export interface IRelationN1 {
  type: 'n:1'
  foreignKey: string
  remoteEntity: string
}
export interface IRelationMN {
  type: 'm:n'
  localPrimaryKey?: string
  relationalEntity: string
  foreignKey: string
  remoteForeignKey: string
  remotePrimaryKey?: string
  remoteEntity: string
}
export type IRelation = IRelation1N | IRelationN1 | IRelationMN

export interface IProperty {
  name: string
  type: 'string' | 'number' | 'boolean' | 'file' | 'float'
  isPk?: boolean
  required?: boolean
  filterable?: boolean |  OperatorsType[]
  connector?: Record<string, unknown> // additional connector settings for this property
  [key: string]: unknown  // aditional settings for plugins (for example: backoffice)
}

export interface IConfig {
  connectors: Record<string, IDataConnector<unknown>>
  graphiql?: boolean
}
