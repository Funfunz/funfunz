'use strict'
import { resolver, resolverCount } from './resolver'
import { buildFields, buildType } from './typeBuilder'
import config from '../utils/configLoader'
import { ITableInfo } from '../../generator/configurationTypes'
import Debug from 'debug'
import { GraphQLFieldConfig, GraphQLFieldConfigArgumentMap, GraphQLFieldConfigMap, GraphQLInt, GraphQLList, Thunk } from 'graphql'
import pluralize from 'pluralize'
import { IUser } from '../types'

const debug = Debug('funfunz:graphql-query-builder')

export type TUserContext = {
  user: IUser,
}

export function buildQueries(): Thunk<GraphQLFieldConfigMap<unknown, TUserContext>> {
  const configs = config()
  const queries: Thunk<GraphQLFieldConfigMap<unknown, TUserContext>> = {}
  configs.settings.forEach(
    (table) => {
      queries[table.name] = buildQuery(table)
      queries[table.name + 'Count'] = buildCount(table)
    }
  )
  debug('Queries built')
  return queries
}

function buildQuery(table: ITableInfo) {
  debug(`Creating ${table.name} query`)
  const query: GraphQLFieldConfig<unknown, TUserContext> = {
    type: new GraphQLList(buildType(table)),
    description: `This will return all the ${pluralize(table.name)}.`,
    resolve: resolver(table),
    args: buildFields(table, { relations: false, pagination: true }) as GraphQLFieldConfigArgumentMap,
  }
  debug(`Created ${table.name} query`)
  return query
}

function buildCount(table: ITableInfo) {
  debug(`Creating ${table.name} query`)
  const query: GraphQLFieldConfig<unknown, TUserContext> = {
    type: GraphQLInt,
    description: `This will return the ${pluralize(table.name)} count.`,
    resolve: resolverCount(table),
    args: buildFields(table, { relations: false, pagination: false }) as GraphQLFieldConfigArgumentMap,
  }
  debug(`Created ${table.name} count`)
  return query
}
