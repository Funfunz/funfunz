import type { SchemaObjectMap, TSchemaOptions } from '../middleware/graphql/manager'
import type { IQueryArgs, DataConnector, ICreateArgs, IRemoveArgs, IUpdateArgs } from './connector'

export type OperationTypes = 'all' | 'config' | 'count' | 'add' | 'query' | 'update' | 'delete'
export type HookTypes = 'beforeResolver' | 'beforeSendQuery' | 'afterQueryResult' | 'afterResultSent'

export interface IArgs {
  [key: string]: unknown
}

export interface IHookProps<Context, SchemaOptions> {
  graph: SchemaObjectMap
  connector: DataConnector
  requestContext: unknown
  args: IArgs
  schemaOptions: TSchemaOptions<SchemaOptions>,
  query?: IQueryArgs | IUpdateArgs | ICreateArgs | IRemoveArgs
  results?: unknown
  context?: Context
}

export type HookFunction<Context, SchemaOptions> = (props: IHookProps<Context, SchemaOptions>) => Promise<IHookProps<Context, SchemaOptions>> | IHookProps<Context, SchemaOptions>

export type IHooks<Context = unknown, SchemaOptions = unknown> = {
  [key in OperationTypes]?: {
    [key in HookTypes]?: HookFunction<Context, SchemaOptions>
  }
}
