'use strict'
import { resolver, resolverCount } from './resolver'
import { buildType } from './typeBuilder'
import config from '../utils/configLoader'
import { ITableInfo } from '../../generator/configurationTypes'
import Debug from 'debug'
import GraphQLJSON from 'graphql-type-json'
import { GraphQLFieldConfig, GraphQLFieldConfigMap, GraphQLInt, GraphQLList, GraphQLObjectType, Thunk } from 'graphql'
import pluralize from 'pluralize'
import { TUserContext } from './schema'
import { buildArgs } from './argumentsBuilder'

const debug = Debug('funfunz:graphql-query-builder')

export function buildQueries(): Thunk<GraphQLFieldConfigMap<unknown, TUserContext>> {
  const configs = config()
  const queries: Thunk<GraphQLFieldConfigMap<unknown, TUserContext>> = {}
  configs.settings.forEach(
    (table) => {
      queries[table.name] = buildQuery(table)
      queries[table.name + 'Count'] = buildCount(table)
    }
  )
  queries.config = buildConfig(configs.settings)
  queries.entities = buildEntities(configs.settings)
  debug('Queries built')
  return queries
}

function buildQuery(table: ITableInfo): GraphQLFieldConfig<unknown, TUserContext> {
  debug(`Creating ${table.name} query`)
  const query: GraphQLFieldConfig<unknown, TUserContext> = {
    type: new GraphQLList(buildType(table)),
    description: `This will return all the ${pluralize(table.name)}.`,
    resolve: resolver(table),
    args: buildArgs(table, { pagination: true, filter: true }),
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
    args: buildArgs(table, { pagination: false,  filter: true }),
  }
  debug(`Created ${table.name} count`)
  return query
}

function buildConfig(tables: ITableInfo[]) {
  debug('Creating config query')

  const resolveData = {}
  const fields = {}
  tables.forEach(
    (table) => {
      if (!table.visible) {
        return
      }
      resolveData[table.name] = table
      fields[table.name] = {
        type: GraphQLJSON,
        description: `${table.name} configuration`,
      }
    }
  )

  const query: GraphQLFieldConfig<unknown, TUserContext> = {
    type: new GraphQLObjectType({
      name: 'config',
      fields,
    }),
    resolve: () => {
      return resolveData
    },
    description: 'This will return the tables configuration.',
  }
  debug('Created config query')
  return query
}

function buildEntities(tables: ITableInfo[]) {
  
  const query: GraphQLFieldConfig<unknown, TUserContext> = {
    type: new GraphQLList(GraphQLJSON),
    resolve: (parent, args, context) => {
      let userRoles = [{
        name: 'unauthenticated'
      }]
      if (context.user?.roles) {
        userRoles = context.user.roles
      }
      const entityNames = tables.filter(
        (table) => {
          const hasAccess = table.roles.read.includes('all') || userRoles.find(
            (role) => {
              table.roles.read.includes(role.name)
            }
          )
          return table.visible && hasAccess
        }
      )
      return entityNames
    },
    description: 'This will return list of entities.',
  }
  debug('Created entities query')
  return query
}
