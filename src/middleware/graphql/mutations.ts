import { buildDeleteMutationType, buildType } from './typeBuilder.js'
import config from '../utils/configLoader.js'
import Debug from 'debug'
import { GraphQLFieldConfig, GraphQLFieldConfigMap, GraphQLList } from 'graphql'
import { capitalize, extractManyToManyRelatedData, getFields, getPKs } from '../utils/index.js'
import { executeHook } from '../utils/lifeCycle.js'
import { normalize } from '../utils/data.js'
import { update, create, remove, query as connectorQuery } from '../dataConnector/index.js'
import { buildArgs } from './argumentsBuilder.js'
import type { ICreateArgs, IRemoveArgs, IUpdateArgs, relatedData } from '../../types/connector.js'
import type { IFilter } from '../utils/filter.js'
import type { IEntityInfo } from '../..//generator/configurationTypes.js'
import type { SchemaManager, TSchemaOptions } from './manager.js'
import { Funfunz } from '../index.js'

const debug = Debug('funfunz:graphql-mutation-builder')

export function buildMutations<OptionsContext>(
  schemaManager: SchemaManager<OptionsContext>,
  options: TSchemaOptions<OptionsContext>
): GraphQLFieldConfigMap<unknown, unknown> {
  const configs = config()
  const mutations: GraphQLFieldConfigMap<unknown, unknown> = {}
  configs.entities.forEach((entity) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const dataConnector = configs.config.connectors[typeof entity.connector === 'string' ? entity.connector : entity.connector.name].connector
    mutations[`add${capitalize(entity.name)}`] = buildAddMutation(entity, schemaManager, options, typeof dataConnector.addMutation === 'function' && dataConnector.addMutation(entity))
    mutations[`update${capitalize(entity.name)}`] = buildUpdateMutation(entity, schemaManager, options, typeof dataConnector.updateMutation === 'function' && dataConnector.updateMutation(entity))
    mutations[`delete${capitalize(entity.name)}`] = buildDeleteMutation(entity, schemaManager, options, typeof dataConnector.deleteMutation === 'function' && dataConnector.deleteMutation(entity))
  })
  debug('Mutations built')
  return mutations
}

function buildUpdateMutation<OptionsContext>(
  entity: IEntityInfo,
  schemaManager: SchemaManager<OptionsContext>,
  options: TSchemaOptions<OptionsContext>,
  dataConnectorMutation?: GraphQLFieldConfig<unknown, unknown>
): GraphQLFieldConfig<unknown, unknown> {
  debug(`Creating ${entity.name} update mutation`)
  const mutation: GraphQLFieldConfig<unknown, unknown>  = {
    type: dataConnectorMutation?.type || new GraphQLList(buildType(entity, schemaManager, options, { relations: true })),
    args: dataConnectorMutation?.args || buildArgs(entity, { pagination: true, data: true, filter: true }),
    resolve: async (parent, rawargs, requestContext, info) => {
      const schemas = schemaManager.getSchemas()
      const { args, context } = await executeHook(entity, 'update', 'beforeResolver', { args: rawargs, requestContext }, options, schemaManager.getSchemas())
      const data = normalize(args.data as Record<string, unknown>, entity)
      const fields = getFields(entity, info)
      const filter = args.filter || undefined

      const newDataset = extractManyToManyRelatedData(data, entity)

      const rawquery: IUpdateArgs = {
        entityName: entity.name,
        fields,
        filter: filter as IFilter,
        data: newDataset.entityData as Record<string, unknown>,
        relatedData: newDataset.relatedData,
        skip: args.skip as number,
        take: args.take as number
      }
      const { query, context: newContext } = await executeHook(entity, 'update', 'beforeSendQuery', { args, query: rawquery, context, requestContext }, options, schemaManager.getSchemas())

      const connectorName = typeof entity.connector === 'string' ? entity.connector : entity.connector.name
      const results = (Object.keys(rawquery.data || {}).length > 0)
        ? await update(connectorName, query as IUpdateArgs) as Record<string, unknown>[]
        : await connectorQuery(connectorName, {
          entityName: rawquery.entityName,
          fields: rawquery.fields as string[],
          filter: rawquery.filter,
          skip: rawquery.skip,
          take: rawquery.take
        }) as Record<string, unknown>[]

      if (rawquery.relatedData) {
        const parentEntity = entity
        await Promise.all(Object.keys(rawquery.relatedData).map(
          (entity) => {
            const entityRelatedData = (rawquery.relatedData as relatedData)[entity]
            const localPrimaryKey = entityRelatedData.localPrimaryKey || getPKs(parentEntity)[0]
            const mutationName = `${entityRelatedData.relationalEntity.charAt(0).toUpperCase() + entityRelatedData.relationalEntity.slice(1)}`
            return Funfunz.executeGraphQL(
              options.isLocal ? schemas.local : schemas.api, `
              mutation {
                delete${mutationName} (
                  filter: {
                    ${entityRelatedData.foreignKey}: {
                      _eq: ${results[0][localPrimaryKey]}
                    }
                  }
                ) {
                  deleted
                }
              }`,
              requestContext
            ).then(() => {
              return Promise.all((entityRelatedData.value as unknown[]).map(
                (value) => {
                  return Funfunz.executeGraphQL(
                    options.isLocal ? schemas.local : schemas.api, `
                    mutation {
                      add${mutationName} (
                        data: {
                          ${entityRelatedData.remoteForeignKey}: ${value}
                          ${entityRelatedData.foreignKey}: ${results[0][localPrimaryKey]}
                        }
                      ){
                        ${entityRelatedData.foreignKey}
                        ${entityRelatedData.remoteForeignKey}
                      }
                    }`,
                    requestContext
                  )
                }
              ))
            })
          }
        ))
      }
      const { results: modifiedResults } = await executeHook(
        entity,
        'update',
        'afterQueryResult',
        {
          requestContext,
          args,
          query,
          results,
          context: newContext
        },
        options,
        schemaManager.getSchemas()
      )
      return modifiedResults
    }
  }
  debug(`Created ${entity.name} add mutation`)
  return mutation
}

function buildAddMutation<OptionsContext>(
  entity: IEntityInfo,
  schemaManager: SchemaManager<OptionsContext>,
  options: TSchemaOptions<OptionsContext>,
  dataConnectorMutation?: GraphQLFieldConfig<unknown, unknown>
): GraphQLFieldConfig<unknown, unknown> {
  debug(`Creating ${entity.name} add mutation`)
  const mutation: GraphQLFieldConfig<unknown, unknown> = {
    type: dataConnectorMutation?.type || new GraphQLList(buildType(entity, schemaManager, options)),
    args: dataConnectorMutation?.args || buildArgs(entity, { data: true }),
    resolve: async (parent, rawargs, requestContext, info) => {
      const schemas = schemaManager.getSchemas()
      const { args, context } = await executeHook(entity, 'add', 'beforeResolver', { args: rawargs, requestContext }, options, schemas)
      const data = normalize(args.data as Record<string, unknown>, entity)
      const fields = getFields(entity, info)
      const newDataset = extractManyToManyRelatedData(data, entity)
      const rawquery: ICreateArgs = {
        entityName: entity.name,
        fields,
        data: newDataset.entityData,
        relatedData: newDataset.relatedData,
        skip: args.skip as number,
        take: args.take as number
      }
      const { query, context: newContext } = await executeHook(entity, 'add', 'beforeSendQuery', { args, query: rawquery, context, requestContext }, options, schemas)
      let results
      try {
        results = await create(typeof entity.connector === 'string' ? entity.connector : entity.connector.name, query as ICreateArgs) as Record<string, unknown>[]
      } catch (err) {
        console.warn({err})
      }
      if (rawquery.relatedData) {
        const parentEntity = entity
        await Promise.all(Object.keys(rawquery.relatedData).map(
          (entity) => {
            const entityRelatedData = (rawquery.relatedData as relatedData)[entity]
            const localPrimaryKey = entityRelatedData.localPrimaryKey || getPKs(parentEntity)[0]
            const mutationName = `add${entityRelatedData.relationalEntity.charAt(0).toUpperCase() + entityRelatedData.relationalEntity.slice(1)}`
            return Promise.all((entityRelatedData.value as unknown[]).map(
              (value) => Funfunz.executeGraphQL(
                options.isLocal ? schemas.local : schemas.api, `
                mutation {
                  ${mutationName} (
                    data: {
                      ${entityRelatedData.remoteForeignKey}: ${value}
                      ${entityRelatedData.foreignKey}: ${results[0][localPrimaryKey]}
                    }
                  ){
                    ${entityRelatedData.foreignKey}
                    ${entityRelatedData.remoteForeignKey}
                  }
                }`,
                requestContext
              )
            ))
          }
        ))
      }
      const { results: modifiedResults } = await executeHook(
        entity,
        'add',
        'afterQueryResult',
        {
          args,
          query,
          results: results,
          context: newContext,
          requestContext
        },
        options,
        schemas
      )
      return modifiedResults
    }
  }
  debug(`Created ${entity.name} add mutation`)
  return mutation
}

function buildDeleteMutation<OptionsContext>(
  entity: IEntityInfo,
  schemaManager: SchemaManager<OptionsContext>,
  options: TSchemaOptions<OptionsContext>,
  dataConnectorMutation?: GraphQLFieldConfig<unknown, unknown>,
): GraphQLFieldConfig<unknown, unknown> {
  debug(`Creating ${entity.name} delete mutation`)
  const mutation: GraphQLFieldConfig<unknown, unknown>  = {
    type: dataConnectorMutation?.type || buildDeleteMutationType(entity),
    args: dataConnectorMutation?.args || buildArgs(entity, { filter: true }),
    resolve: async (parent, rawargs, requestContext) => {
      const { args, context } = await executeHook(entity, 'delete', 'beforeResolver', { args: rawargs, requestContext }, options, schemaManager.getSchemas())
      const rawquery: IRemoveArgs = {
        entityName: entity.name,
        filter: args.filter as IFilter
      }
      const { query, context: newContext } = await executeHook(entity, 'delete', 'beforeSendQuery', { args, query: rawquery, context, requestContext }, options, schemaManager.getSchemas())

      const deleted = await remove(typeof entity.connector === 'string' ? entity.connector : entity.connector.name, query as IRemoveArgs)
      const results = { deleted }

      const { results: modifiedResults } = await executeHook(
        entity,
        'delete',
        'afterQueryResult',
        {
          args,
          query,
          results,
          context: newContext,
          requestContext,
        },
        options,
        schemaManager.getSchemas()
      )
      return modifiedResults
    },
  }
  debug(`Created ${entity.name} delete mutation`)
  return mutation
}
