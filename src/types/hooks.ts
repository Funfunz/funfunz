import { GraphQLSchema, ExecutionResult } from 'graphql'
import { IQueryArgs, DataConnector } from '../middleware/dataConnector'

export type HookTypes = 'all' | 'config' | 'count' | 'add' | 'query' | 'update' | 'delete'

export interface IArgs {
  [key: string]: unknown
}

export interface IHookArgs<U, C> {
  graph: GraphQLSchema
  connector: DataConnector
  user: U
  input: IArgs
  query?: IQueryArgs
  results?: ExecutionResult
  context?: C
}

export type HookFunction<U, C> = (args: IHookArgs<U, C>) => Promise<IHookArgs<U, C>>

export type ITableHooks<U, C> = {
  [key in HookTypes]?: {
    beforeResolver?: HookFunction<U, C>
    beforeSendQuery?: HookFunction<U, C>
    afterQueryResult?: HookFunction<U, C>
    afterResultSent?: HookFunction<U, C>
  }
}
