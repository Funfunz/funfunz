import { resolver } from '@root/api/graphql/resolver'
import config from '@root/api/utils/configLoader'
import { ITableInfo } from '@root/generator/configGenerator'
import Debug from 'debug'
import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
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
            ? relation.table
            : column.name
          const relatedTable = config().settings.filter(
            (settingsTable) => settingsTable.name === relation.table
          )[0]
          result[columnName] = {
            type: buildType(relatedTable),
            description: column.verbose,
            resolve: resolver(relatedTable, table),
            args: buildFields(relatedTable, false),
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
      Object.keys(table.relations.manyToOne).forEach(
        (tableName) => {
          const relation = ((table.relations || {}).manyToOne || {})[tableName]
          if (relation) {
            const columnName = tableName
            const relationTable = config().settings.filter(
              (settingsTable) => settingsTable.name === tableName
            )[0]
            result[columnName] = {
              type: new GraphQLList(buildType(relationTable)),
              description: relationTable.verbose,
              resolve: resolver(relationTable, table),
              args: buildFields(relationTable, false),
            }
          }
        }
      )
    }
    if (table.relations.manyToMany) {
      table.relations.manyToMany.forEach(
        (relation) => {
          const columnName = relation.remoteTable
          const remoteTable = config().settings.filter(
            (settingsTable) => settingsTable.name === relation.remoteTable
          )[0]
          result[columnName] = {
            type: new GraphQLList(buildType(remoteTable)),
            description: relation.verbose,
            resolve: resolver(remoteTable, table),
            args: buildFields(remoteTable, false),
          }
        }
      )
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
