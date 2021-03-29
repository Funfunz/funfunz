import express from 'express'
import { Thunk, GraphQLFieldConfigMap } from 'graphql'
import { IConfig, IEntityInfo } from '../generator/configurationTypes'

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

export interface IFunfunzConfig<QSource = unknown, QContext = unknown, SchemaContext = unknown> {
  config: IConfig
  entities: IEntityInfo[]
  queries?: Thunk<GraphQLFieldConfigMap<QSource, QContext>>
  mutations?: Thunk<GraphQLFieldConfigMap<QSource, QContext>>
  context?: SchemaContext
}

export interface IFunfunzRequest extends express.Request {
  user?: IUser;
}
