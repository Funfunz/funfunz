import { resolver } from '@root/api/graphql/resolver'
import config from '@root/api/utils/configLoader'
import { ITableInfo } from '@root/configGenerator'
import Debug from 'debug'
import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLFieldConfigMap,
  Thunk,
} from 'graphql'

const debug = Debug('funfunzmc:graphql-type-builder')

const MATCHER: {
  [key: string]: any
} = {
  'varchar(255)': GraphQLString,
  'int(11)': GraphQLInt,
  'tinyint(1)': GraphQLBoolean,
  'datetime': GraphQLString,
}

const types: {
  [key: string]: GraphQLObjectType | GraphQLInputObjectType,
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
          if (column.name !== columnName) {
            result[column.name] = {
              type: GraphQLID,
              description: column.verbose,
            }
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

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function buildType(table: ITableInfo) {
  const name = table.name
  debug(`Creating ${name}`)
  if (!types[name]) {
    types[name] = new GraphQLObjectType({
      name,
      fields: () => {
        return buildFields(table, true)
      },
    })
    debug(`Created ${name}`)
  }
  return types[name]
}
export function buildInputType(table: ITableInfo) {
  const name = table.name + 'Input'
  debug(`Creating ${name}`)
  if (!types[name]) {
    types[name] = new GraphQLInputObjectType({
      name,
      fields: () => {
        return buildFields(table, false)
      },
    })
    debug(`Created ${name}`)
  }
  return types[name]
}
export function buildUpdateByIdMutationType(table: ITableInfo) {
  const name = `update${capitalize(table.name)}ById`
  debug(`Creating ${name}`)
  if (!types[name]) {
    types[name] = new GraphQLObjectType({
      name,
      fields: () => {
        return buildFields(table, false)
      },
    })
    debug(`Created ${name}`)
  }
  return types[name]
}
export function buildAddMutationType(table: ITableInfo) {
  const name = `add${capitalize(table.name)}`
  debug(`Creating ${name}`)
  if (!types[name]) {
    types[name] = new GraphQLObjectType({
      name,
      fields: () => {
        return buildFields(table, false)
      },
    })
    debug(`Created ${name}`)
  }
  return types[name]
}
export function buildDeleteMutationType(table: ITableInfo) {
  const name = `delete${capitalize(table.name)}`
  debug(`Creating ${name}`)
  if (!types[name]) {
    types[name] = new GraphQLObjectType({
      name,
      fields: () => ({
        success: {
          type: GraphQLBoolean,
        },
      }),
    })
    debug(`Created ${name}`)
  }
  return types[name]
}
