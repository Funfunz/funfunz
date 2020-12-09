import express from 'express'
import { Thunk, GraphQLFieldConfigMap } from 'graphql'
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

export interface IFunfunzConfig<QSource = any, QContext = any> {
  config: IConfig
  settings: ISettings
  queries?: Thunk<GraphQLFieldConfigMap<QSource, QContext>>
  mutations?: Thunk<GraphQLFieldConfigMap<QSource, QContext>>
}

export interface IFunfunzRequest extends express.Request {
  user?: IUser;
}
