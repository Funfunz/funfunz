import { GraphQLScalarType, GraphQLString, GraphQLInt, GraphQLBoolean } from 'graphql'

export const MATCHER: {
  [key: string]: GraphQLScalarType
} = {
  'varchar(255)': GraphQLString,
  'int(11)': GraphQLInt,
  'smallint': GraphQLInt,
  'int': GraphQLInt,
  'tinyint(1)': GraphQLBoolean,
  'datetime': GraphQLString,
}