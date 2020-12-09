import type { IQueryArgs, DataConnector, ICreateArgs, IRemoveArgs, IUpdateArgs } from './connector'
import { ExecuteGraphQL } from './graphql'

export type OperationTypes = 'all' | 'config' | 'count' | 'add' | 'query' | 'update' | 'delete'
export type HookTypes = 'beforeResolver' | 'beforeSendQuery' | 'afterQueryResult' | 'afterResultSent'

export interface IArgs {
  [key: string]: unknown
}

export interface IHookProps<C> {
  graph: ExecuteGraphQL
  connector: DataConnector
  req: unknown
  res: unknown
  args: IArgs
  query?: IQueryArgs | IUpdateArgs | ICreateArgs | IRemoveArgs
  results?: unknown
  context?: C
}

export type HookFunction<C> = (props: IHookProps<C>) => Promise<IHookProps<C>>

export type ITableHooks = {
  [key in OperationTypes]?: {
    [key in HookTypes]?: HookFunction<unknown>
  }
}
