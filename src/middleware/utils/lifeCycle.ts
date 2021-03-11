import { IEntityInfo } from '../../generator/configurationTypes'
import { HookTypes, IHookProps, OperationTypes } from '../../types/hooks'
import { connector } from '../dataConnector'
import type { SchemaObjectMap, TSchemaOptions } from '../graphql/manager'

export async function executeHook(
  entity: IEntityInfo,
  operationType: OperationTypes,
  hookType: HookTypes,
  props: Partial<IHookProps<unknown, unknown>>,
  schemaOptions: TSchemaOptions<unknown>,
  schemas: SchemaObjectMap
): Promise<IHookProps<unknown, unknown>> {
  const fullprops: IHookProps<unknown, unknown> = {
    ...props as IHookProps<unknown, unknown>,
    schemaOptions,
    graph: schemas,
    connector: connector(typeof entity.connector === 'string' ? entity.connector : entity.connector.name)
  }
  const func = entity.hooks?.all?.[hookType] || entity.hooks?.[operationType]?.[hookType]
  if (!func) {
    return fullprops
  }
  return (await func(fullprops)) || fullprops
}
