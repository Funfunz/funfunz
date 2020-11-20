import { Funfunz } from '..'
import { IEntityInfo } from '../../generator/configurationTypes'
import { HookTypes, IHookProps, OperationTypes } from '../../types/hooks'
import { connector } from '../dataConnector'

export async function executeHook(
  table: IEntityInfo,
  operationType: OperationTypes,
  hookType: HookTypes,
  props: Partial<IHookProps<unknown>>,
  funfunz: Funfunz
): Promise<IHookProps<unknown>> {
  const fullprops: IHookProps<unknown> = {
    ...props as IHookProps<unknown>,
    graph: funfunz.executeGraphQL,
    connector: connector(table.connector)
  }
  const func = table.hooks?.[operationType]?.[hookType]
  if (!func) {
    return fullprops
  }
  return await func(fullprops)
}
