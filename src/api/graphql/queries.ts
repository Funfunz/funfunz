'use strict'
import { resolver, resolverCount } from '@root/api/graphql/resolver'
import { buildFields, buildType } from '@root/api/graphql/typeBuilder'
import config from '@root/api/utils/configLoader'
import { ITableInfo } from '@root/generator/configurationTypes'
import Debug from 'debug'
import { GraphQLList, GraphQLInt } from 'graphql'
import pluralize from 'pluralize'

const debug = Debug('funfunzmc:graphql-query-builder')

export default function buildQueries() {
  const configs = config()
  const queries: {
    [key: string]: any
  } = {}
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
  const query = {
    type: new GraphQLList(buildType(table)),
    description: `This will return all the ${pluralize(table.name)}.`,
    resolve: resolver(table),
    args: buildFields(table, { relations: false, pagination: true }),
  }
  debug(`Created ${table.name} query`)
  return query
}

function buildCount(table: ITableInfo) {
  debug(`Creating ${table.name} query`)
  const query = {
    type: GraphQLInt,
    description: `This will return the ${pluralize(table.name)} count.`,
    resolve: resolverCount(table),
    args: buildFields(table, { relations: false, pagination: false }),
  }
  debug(`Created ${table.name} count`)
  return query
}
