import { HttpException, IMCRequest, IMCResponse } from '@root/api/types'
import config from '@root/api/utils/configLoader'
import { Hooks, ITableInfo } from '@root/configGenerator'
import { ErrorRequestHandler, NextFunction } from 'express'
import Knex from 'knex'

export function catchMiddleware(next: NextFunction) {
  return (err: HttpException) => {
    if (next) {
      next(err)
    }
    return Promise.resolve({
      error: err,
    })
  }
}

export function buildError(message: string, status: number) {
  const err = new HttpException(status, message)
  return err
}

export function addToResponse(res: IMCResponse, target: string) {
  return function(data: any) {
    if (res) {
      res.data = {
        ...res.data,
        [target]: data,
      }
      return res
    }
    throw buildError('Response object not valid', 500)
  }
}

export function nextAndReturn(next: NextFunction) {
  return function(data: any) {
    if (next) {
      next()
    }
    return Promise.resolve(data)
  }
}

// error handler
export const errorHandler: ErrorRequestHandler = (err, req, res) => {
  res.status(err.status || 500)
  res.json({
    message: err.message,
  })
}

export function hasAuthorization(tableRoles: string[], userRoles: string[]): boolean {
  let isAuthorized: string | undefined = 'true'

  if (tableRoles && tableRoles.length) {
    isAuthorized = tableRoles.find(
      (tableRole: string) => {
        if (tableRole === 'all') {
          return true
        }
        const userHasAuthorization = userRoles.find(
          (userRole: string) => {
            return (userRole === tableRole);
          }
        )
        return userHasAuthorization ? true : false
      }
    )
  }

  return isAuthorized ? true : false
}

export function filterTableColumns(table: ITableInfo, target: 'main' | 'detail') {
  return table.columns.filter(
    (column) => column.visible[target]
  ).map(
    (column) => column.name
  )
}

export function runHook(
  TABLE: ITableInfo,
  hook: Hooks,
  instance: 'after' | 'before',
  req: IMCRequest,
  res: IMCResponse,
  database: Knex | null,
  results: any
) {
  if (TABLE.hooks && TABLE.hooks[hook]) {
    const HOOK = TABLE.hooks[hook]
    if (database && HOOK && HOOK[instance]) {
      const CALLER  = HOOK[instance]
      return CALLER ?
        CALLER(req, res, database, TABLE.name, results) :
        Promise.resolve(hook === 'getTableCount' ? results.length : results)
    }
  }
  return Promise.resolve(hook === 'getTableCount' ? results.length : results)
}

export function getTableConfig(TABLE_NAME: string) {
  return config().settings.filter(
    (tableItem) => tableItem.name === TABLE_NAME
  )[0]
}
