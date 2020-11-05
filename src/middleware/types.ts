import express from 'express'
import { IConfig, ISettings } from '../generator/configurationTypes'

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

export interface IFunfunzConfig {
  config: IConfig
  settings: ISettings
}

export interface IFunfunzRequest extends express.Request {
  user?: IUser;
}
