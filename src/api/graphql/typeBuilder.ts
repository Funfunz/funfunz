import { resolverById } from '@root/api/graphql/resolver'
import config from '@root/api/utils/configLoader'
import { ITableInfo } from '@root/configGenerator'
import Debug from 'debug'
import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'

const debug = Debug('funfunzmc:graphql-type-builder')

const MATCHER: {
  [key: string]: any
} = {
  'varchar(255)': GraphQLString,
  'int(11)': GraphQLInt,
  'tinyint(1)': GraphQLBoolean,
}

const types: {
  [key: string]: GraphQLObjectType,
} = {}

export function buildType(table: ITableInfo) {
  debug(`Creating ${table.name}`)
  if (!types[table.name]) {
    types[table.name] = new GraphQLObjectType({
      name: table.name,
      description: `${table.name} Type`,
      fields: () => {
        const result: {
          [key: string]: any
        } = {}
        table.columns.forEach(
          (column) => {
            if (!column.relation && (table.pk === column.name || MATCHER[column.type])) {
              result[column.name] = {
                type: table.pk === column.name ? GraphQLID : MATCHER[column.type],
                description: column.verbose,
              }
            }

            if (column.relation) {
              const relation = column.relation
              result[column.verbose] = {
                type: buildType(config().settings.filter(
                  (settingsTable) => settingsTable.name === relation.table
                )[0]),
                description: column.verbose,
                resolve: resolverById(table, column),
              }
            }
          }
        )
        return result
      },
    })
    debug(`Created ${table.name}`)
  }
  return types[table.name]
}
