import express from 'express'
import { GraphQLFieldConfigMap } from 'graphql'
import { IConfig, IEntityInfo } from './utils/configurationTypes.js'

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
  queries?: GraphQLFieldConfigMap<QSource, QContext>
  mutations?: GraphQLFieldConfigMap<QSource, QContext>
  context?: SchemaContext
}

export interface IFunfunzRequest extends express.Request {
  user?: IUser;
}
