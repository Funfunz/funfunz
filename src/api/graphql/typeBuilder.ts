import { resolverById, resolver } from '@root/api/graphql/resolver'
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
import { singular } from 'pluralize'

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

export function buildFields(table: ITableInfo, relations: boolean = true) {
  const result: {
    [key: string]: any
  } = {}
  table.columns.forEach(
    (column) => {
      const isPk = table.pk.indexOf(column.name) >= 0
      if (!column.relation && (table.pk.indexOf(column.name) >= 0 || MATCHER[column.type])) {
        result[column.name] = {
          type: isPk ? GraphQLID : MATCHER[column.type],
          description: column.verbose,
        }
      }

      if (column.relation) {
        if (relations) {
          const relation = column.relation
          const columnName = relation.type === 'oneToMany'
            ? singular(relation.table)
            : column.name
          result[columnName] = {
            type: buildType(config().settings.filter(
              (settingsTable) => settingsTable.name === relation.table
            )[0]),
            description: column.verbose,
            resolve: resolverById(table, column),
          }
        } else {
          result[column.name] = {
            type: GraphQLID,
            description: column.verbose,
          }
        }
      }
    }
  )
  if (table.relations && relations) {
    if (table.relations.manyToOne) {
      Object.keys(table.relations.manyToOne).forEach((tableName) => {
        const relation = ((table.relations || {}).manyToOne || {})[tableName]
        if (relation) {
          const columnName = singular(tableName)
          const relationTable = config().settings.filter(
            (settingsTable) => settingsTable.name === tableName
          )[0]
          result[columnName] = {
            type: buildType(relationTable),
            description: relationTable.verbose,
            resolve: resolver(relationTable),
          }
        }
      })
    }
  }
  return result
}

export function buildType(table: ITableInfo) {
  debug(`Creating ${table.name}`)
  if (!types[table.name]) {
    types[table.name] = new GraphQLObjectType({
      name: table.name,
      description: `${table.name} Type`,
      fields: () => {
        return buildFields(table, true)
      },
    })
    debug(`Created ${table.name}`)
  }
  return types[table.name]
}
