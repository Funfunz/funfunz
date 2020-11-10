import { ExecutionResult } from 'graphql'
import { IQueryArgs, DataConnector } from './connector'
import { ExecuteGraphQL } from './graphql'

export type HookTypes = 'all' | 'config' | 'count' | 'add' | 'query' | 'update' | 'delete'

export interface IArgs {
  [key: string]: unknown
}

export interface IHookProps<U, C> {
  graph: ExecuteGraphQL
  connector: DataConnector
  user: U
  args: IArgs
  query?: IQueryArgs
  results?: ExecutionResult
  context?: C
}

export type HookFunction<U, C> = (props: IHookProps<U, C>) => Promise<IHookProps<U, C>>

export type ITableHooks<U, C> = {
  [key in HookTypes]?: {
    beforeResolver?: HookFunction<U, C>
    beforeSendQuery?: HookFunction<U, C>
    afterQueryResult?: HookFunction<U, C>
    afterResultSent?: HookFunction<U, C>
  }
}
