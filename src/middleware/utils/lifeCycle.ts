import Knex from 'knex'
import { IFunfunzRequest, IFunfunzResponse } from '../types'
import { ITableInfo, Hooks } from '../../generator/configurationTypes'

export function runHook(
  TABLE: ITableInfo,
  hook: Hooks,
  instance: 'after' | 'before',
  req: IFunfunzRequest,
  res: IFunfunzResponse,
  databaseInstance: Knex | null,
  results?: Record<string, unknown>
): Promise<number | Record<string, unknown> | undefined> {
  if (TABLE.hooks && TABLE.hooks[hook]) {
    const HOOK = TABLE.hooks[hook]
    if (databaseInstance && HOOK && HOOK[instance]) {
      const CALLER  = HOOK[instance]
      return CALLER
        ? CALLER(req, res, databaseInstance, TABLE.name, results)
        : Promise.resolve(hook === 'getTableCount' ? (results?.length as number) : results)
    }
  }
  return Promise.resolve(hook === 'getTableCount' ? (results?.length as number) : results)
}