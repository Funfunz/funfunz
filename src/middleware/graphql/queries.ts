'use strict'
import { resolver, resolverCount } from './resolver'
import { buildType } from './typeBuilder'
import config from '../utils/configLoader'
import { IEntityInfo } from '../../generator/configurationTypes'
import Debug from 'debug'
import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json'
import { GraphQLBoolean, GraphQLFieldConfig, GraphQLFieldConfigMap, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString, Thunk } from 'graphql'
import pluralize from 'pluralize'
import { buildArgs } from './argumentsBuilder'
import type { SchemaManager, TSchemaOptions } from './manager'

const debug = Debug('funfunz:graphql-query-builder')

export function buildQueries<OptionsContext>(schemaManager: SchemaManager<OptionsContext>, options: TSchemaOptions<OptionsContext>): Thunk<GraphQLFieldConfigMap<unknown, unknown>> {
  const configs = config()
  const queries: Thunk<GraphQLFieldConfigMap<unknown, unknown>> = {}
  configs.settings.forEach(
    (table) => {
      if (table.visible) {
        queries[table.name] = buildQuery<OptionsContext>(table, schemaManager, options)
        queries[table.name + 'Count'] = buildCount(table, schemaManager, options)
      }
    }
  )
  queries.config = buildConfig(configs.settings)
  queries.entities = buildEntities(configs.settings)
  debug('Queries built')
  return queries
}

function buildQuery<OptionsContext>(table: IEntityInfo, schemaManager: SchemaManager<OptionsContext>, options: TSchemaOptions<OptionsContext>): GraphQLFieldConfig<unknown, unknown> {
  debug(`Creating ${table.name} query`)
  const query: GraphQLFieldConfig<unknown, unknown> = {
    type: new GraphQLList(buildType(table, schemaManager, options)),
    description: `This will return all the ${pluralize(table.name)}.`,
    resolve: resolver(table, schemaManager, options),
    args: buildArgs(table, { pagination: true, filter: true }),
  }
  debug(`Created ${table.name} query`)
  return query
}

function buildCount<OptionsContext>(table: IEntityInfo, schemaManager: SchemaManager<OptionsContext>, options: TSchemaOptions<OptionsContext>) {
  debug(`Creating ${table.name} query`)
  const query: GraphQLFieldConfig<unknown, unknown> = {
    type: GraphQLInt,
    description: `This will return the ${pluralize(table.name)} count.`,
    resolve: resolverCount(table, schemaManager, options),
    args: buildArgs(table, { pagination: false,  filter: true }),
  }
  debug(`Created ${table.name} count`)
  return query
}

function buildConfig(tables: IEntityInfo[]) {
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

  const query: GraphQLFieldConfig<unknown, unknown> = {
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

function buildEntities(tables: IEntityInfo[]) {
  
  const query: GraphQLFieldConfig<unknown, unknown> = {
    type: new GraphQLList(new GraphQLObjectType({
      name: 'tableConfig',
      fields: {
        name: {
          type: GraphQLString,
          description: 'Name of the entity'
        },
        connector: {
          type: GraphQLString,
          description: 'Type of connector'
        },
        relations: {
          description: 'Relation list',
          type: new GraphQLList(
            new GraphQLObjectType({
              name: 'tableConfigRelations',
              fields: {
                type: {
                  type: GraphQLString,
                  description: 'Type of relation'
                },
                foreignKey: {
                  type: GraphQLString,
                  description: 'Name of the foreignKey'
                },
                remoteTable: {
                  type: GraphQLString,
                  description: 'Name of target entity'
                },
              }
            })
          ),
        },
        properties: {
          description: 'Property list',
          type: new GraphQLList(
            new GraphQLObjectType({
              name: 'propertyConfig',
              fields: {
                name: {
                  type: GraphQLString,
                  description: 'Name of the property'
                },
                model: {
                  description: 'Property model',
                  type: new GraphQLObjectType({
                    name: 'columnModel',
                    fields: {
                      type: {
                        type: GraphQLString,
                        description: 'Type of property'
                      },
                      allowNull: {
                        type: GraphQLBoolean,
                        description: 'Allows null values'
                      },
                      isPk: {
                        type: GraphQLBoolean,
                        description: 'Is a primary key'
                      }
                    }
                  }),
                },
                layout: {
                  type: GraphQLJSONObject
                }
              }
            })
          ),
        },
        layout: {
          type: GraphQLJSONObject
        }
      }
    })),
    args: {
      name: {
        type: GraphQLString
      }
    },
    resolve: (parent, args) => {
      const requestedEntity = args.name
      const entityNames = tables.filter(
        (table) => {
          if (requestedEntity && requestedEntity !== table.name) {
            return false
          }
          return table.visible
        }
      )
      return entityNames
    },
    description: 'This will return list of entities.',
  }
  debug('Created entities query')
  return query
}
