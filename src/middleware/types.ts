import express from 'express'

export interface IUser {
  [key: string]: unknown,
  roles: Array<{
    id: number,
    name: string,
  }>,
}

export interface IFunfunzResponse extends express.Response {
  data?: Record<string, unknown>
}

export interface IFunfunzRequest extends express.Request {
  user?: IUser;
}
