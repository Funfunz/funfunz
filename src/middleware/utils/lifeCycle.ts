import { ITableInfo } from '../../generator/configurationTypes'
import { HookTypes, IHookProps, OperationTypes } from '../../types/hooks'
import { globalGraph } from '../routes'
import { connector } from '../dataConnector'

export async function executeHook(
  table: ITableInfo,
  operationType: OperationTypes,
  hookType: HookTypes,
  props: Partial<IHookProps<unknown>>,
): Promise<IHookProps<unknown>> {
  const fullprops: IHookProps<unknown> = {
    ...props as IHookProps<unknown>,
    graph: globalGraph,
    connector: connector(table.connector)
  }
  const func = table.hooks?.[operationType]?.[hookType]
  if (!func) {
    return fullprops
  }
  return await func(fullprops)
}
