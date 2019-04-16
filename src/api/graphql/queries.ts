'use strict'
import { resolver } from '@root/api/graphql/resolver'
import { buildType } from '@root/api/graphql/typeBuilder'
import config from '@root/api/utils/configLoader'
import { ITableInfo } from '@root/configGenerator'
import Debug from 'debug'
import { GraphQLList } from 'graphql'
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
  }
  debug(`Created ${table.name} query`)
  return query
}
