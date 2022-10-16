import { GraphQLScalarType, GraphQLString, GraphQLInt, GraphQLFloat, GraphQLBoolean } from 'graphql'
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs'

export const MATCHER: {
  [key: string]: GraphQLScalarType
} = {
  'string': GraphQLString,
  'number': GraphQLInt,
  'boolean': GraphQLBoolean,
  'file': GraphQLUpload,
  'float': GraphQLFloat,
}