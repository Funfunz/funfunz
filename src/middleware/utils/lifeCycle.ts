import { IFunfunzRequest, IFunfunzResponse } from '../types'
import { ITableInfo, Hooks } from '../../generator/configurationTypes'
import { HookTypes, IHookProps, ITableHooks, OperationTypes } from '../../types/hooks'
import { globalGraph } from '../routes'
import { connector } from '../dataConnector'

export async function executeHook(
  table: ITableInfo,
  operationType: OperationTypes,
  hookType: HookTypes,
  props: Partial<IHookProps<unknown, unknown>>,
): Promise<IHookProps<unknown, unknown>> {
  const fullprops: IHookProps<unknown, unknown> = {
    ...props as IHookProps<unknown, unknown>,
    graph: globalGraph,
    connector: connector(table.connector)
  }
  const operationHooks = (table.hooks as ITableHooks<unknown, unknown>)[operationType]
  if (!operationHooks) {
    return fullprops
  }
  const func = operationHooks[hookType]
  if (!func) {
    return fullprops
  }
  return await func(fullprops)
}

export function runHook(
  TABLE: ITableInfo,
  hook: Hooks,
  instance: 'after' | 'before',
  req: IFunfunzRequest,
  res: IFunfunzResponse,
  databaseInstance: unknown | null,
  results?: unknown
): Promise<unknown | undefined> {
  if (TABLE.hooks && TABLE.hooks[hook]) {
    const HOOK = TABLE.hooks[hook]
    if (databaseInstance && HOOK && HOOK[instance]) {
      const CALLER  = HOOK[instance]
      return CALLER
        ? CALLER(req, res, databaseInstance, TABLE.name, results)
        : Promise.resolve(results)
    }
  }
  return Promise.resolve(results)
}