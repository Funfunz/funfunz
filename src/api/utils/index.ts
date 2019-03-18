import { HttpException, IMCResponse } from '@root/api/types';
import { ErrorRequestHandler, NextFunction } from 'express'

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

export function addToResponse(res: IMCResponse, data: any, target: string) {
  if (res) {
    res.data = {
      ...res.data,
      [target]: data,
    }
    return res
  }
  throw buildError('Response object not valid', 500)
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
