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
  configs.entities.forEach(
    (entity) => {
      if (entity.visible) {
        queries[entity.name] = buildQuery<OptionsContext>(entity, schemaManager, options)
        queries[entity.name + 'Count'] = buildCount(entity, schemaManager, options)
      }
    }
  )
  queries.config = buildConfig(configs.entities)
  queries.entities = buildEntities(configs.entities)
  debug('Queries built')
  return queries
}

function buildQuery<OptionsContext>(entity: IEntityInfo, schemaManager: SchemaManager<OptionsContext>, options: TSchemaOptions<OptionsContext>): GraphQLFieldConfig<unknown, unknown> {
  debug(`Creating ${entity.name} query`)
  const query: GraphQLFieldConfig<unknown, unknown> = {
    type: new GraphQLList(buildType(entity, schemaManager, options)),
    description: `This will return all the ${pluralize(entity.name)}.`,
    resolve: resolver(entity, schemaManager, options),
    args: buildArgs(entity, { pagination: true, filter: true }),
  }
  debug(`Created ${entity.name} query`)
  return query
}

function buildCount<OptionsContext>(entity: IEntityInfo, schemaManager: SchemaManager<OptionsContext>, options: TSchemaOptions<OptionsContext>) {
  debug(`Creating ${entity.name} query`)
  const query: GraphQLFieldConfig<unknown, unknown> = {
    type: GraphQLInt,
    description: `This will return the ${pluralize(entity.name)} count.`,
    resolve: resolverCount(entity, schemaManager, options),
    args: buildArgs(entity, { pagination: false,  filter: true }),
  }
  debug(`Created ${entity.name} count`)
  return query
}

function buildConfig(entities: IEntityInfo[]) {
  debug('Creating config query')

  const resolveData = {}
  const fields = {}
  entities.forEach(
    (entity) => {
      if (!entity.visible) {
        return
      }
      resolveData[entity.name] = entity
      fields[entity.name] = {
        type: GraphQLJSON,
        description: `${entity.name} configuration`,
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
    description: 'This will return the entities configuration.',
  }
  debug('Created config query')
  return query
}

function buildEntities(entities: IEntityInfo[]) {
  
  const query: GraphQLFieldConfig<unknown, unknown> = {
    type: new GraphQLList(new GraphQLObjectType({
      name: 'entityConfig',
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
              name: 'entityConfigRelations',
              fields: {
                type: {
                  type: GraphQLString,
                  description: 'Type of relation'
                },
                foreignKey: {
                  type: GraphQLString,
                  description: 'Name of the foreignKey'
                },
                remoteEntity: {
                  type: GraphQLString,
                  description: 'Name of target entity'
                },
                remoteForeignKey: {
                  type: GraphQLString,
                  description: 'Name of target foreignKey'
                },
                relationalEntity: {
                  type: GraphQLString,
                  description: 'Name of relational entity'
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
                type: {
                  type: GraphQLString,
                  description: 'Type of property'
                },
                required: {
                  type: GraphQLBoolean,
                  description: 'Allows null values'
                },
                isPk: {
                  type: GraphQLBoolean,
                  description: 'Is a primary key'
                },
                connector: {
                  type: GraphQLJSONObject
                },
                backoffice: {
                  type: GraphQLJSONObject
                }
              }
            })
          ),
        },
        backoffice: {
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
      const entityNames = entities.filter(
        (entity) => {
          if (requestedEntity && requestedEntity !== entity.name) {
            return false
          }
          return entity.visible
        }
      )
      return entityNames
    },
    description: 'This will return list of entities.',
  }
  debug('Created entities query')
  return query
}
