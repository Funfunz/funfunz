import { HttpException, MCResponse } from '@root/api/types';
import { ErrorRequestHandler, NextFunction } from 'express'

export function catchMiddleware(next: NextFunction) {
  return (err: HttpException) => {
    if (next) {
      next(err)
    }
    return {
      error: err,
    }
  }
}

export function buildError(message: string, status: number) {
  const err = new HttpException(status, message)
  return err
}

export function addToResponse(res: MCResponse, data: any, target: string) {
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
    return data
  }
}

// error handler
export const errorHandler: ErrorRequestHandler = (err, req, res) => {
  res.status(err.status || 500)
  res.json({
    message: err.message,
  })
}
