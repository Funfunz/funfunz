'use strict'
import queries from '@root/api/graphql/queries'
import Debug from 'debug'
import {
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql'

const debug = Debug('funfunzmc:graphql-schema')

// export the schema
debug('Created')
export default () => {
  debug('Creating')
  // lets define our root query
  const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'This is the default root query provided by our application',
    fields: {
      ...queries(),
    },
  })

  return new GraphQLSchema({
    query: RootQuery,
  })
}
