'use strict'
import mutations from './mutations'
import { buildQueries } from './queries'
import Debug from 'debug'
import {
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql'
import { IFunfunzConfig, IUser } from '../types'
import { Request, Response } from 'express'
import type { Funfunz } from '../index'

export type TUserContext = {
  user: IUser,
  req: Request,
  res: Response
  superUser?: boolean
}

const debug = Debug('funfunz:graphql-schema')

export let schema: GraphQLSchema

// export the schema
export default (
  funfunz: Funfunz,
  customGraphQL?: {
    queries?: IFunfunzConfig['queries']
    mutations?: IFunfunzConfig['mutations']
  }
): GraphQLSchema => {
  debug('Creating graphql schema')
  // lets define our root query
  const RootQuery = new GraphQLObjectType({
    name: 'Query',
    fields: {
      ...buildQueries(funfunz),
      ...customGraphQL?.queries
    },
  })
  
  const RootMutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      ...mutations(funfunz),
      ...customGraphQL?.mutations
    },
  })

  schema = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation,
  })
  return schema
}
