'use strict'
import mutations from './mutations'
import queries from './queries'
import Debug from 'debug'
import {
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql'

const debug = Debug('funfunz:graphql-schema')

export let schema: GraphQLSchema

// export the schema
debug('Created')
export default (): GraphQLSchema => {
  debug('Creating')
  // lets define our root query
  const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'This is the default root query provided by our application',
    fields: {
      ...queries(),
    },
  })
  const RootMutation = new GraphQLObjectType({
    name: 'Mutation',
    description: 'This is the default root mutation provided by our application',
    fields: {
      ...mutations(),
    },
  })

  schema = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation,
  })
  return schema
}
