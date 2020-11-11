import { IFunfunzRequest, IFunfunzResponse } from '../types'
import { ITableInfo, Hooks } from '../../generator/configurationTypes'

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