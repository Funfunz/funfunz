import { GraphQLScalarType, GraphQLString, GraphQLInt, GraphQLBoolean } from 'graphql'

export const MATCHER: {
  [key: string]: GraphQLScalarType
} = {
  'string': GraphQLString,
  'number': GraphQLInt,
  'boolean': GraphQLBoolean,
}