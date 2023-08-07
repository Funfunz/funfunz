import { query as sendQuery } from '../dataConnector/index.js'
import { getFields } from '../utils/index.js'
import { IEntityInfo } from '../../generator/configurationTypes.js'
import { GraphQLFieldResolver } from 'graphql'
import { getParentEntryFilter, FilterValues, ParentFilterResult, IFilter } from '../utils/filter.js'
import { executeHook } from '../utils/lifeCycle.js'
import { IQueryArgs } from '../../types/connector.js'
import type { SchemaManager, TSchemaOptions } from './manager.js'

export function resolver<SchemaOptions>(
  entity: IEntityInfo,
  schemaManager: SchemaManager<SchemaOptions>,
  options: TSchemaOptions<SchemaOptions>,
  parentEntity?: IEntityInfo,
  relationType?: '1:n' | 'n:1' | 'm:n',
): GraphQLFieldResolver<unknown, unknown> {
  return async (parent, rawargs, requestContext, info) => {
    const { args, context } = await executeHook(entity, 'query', 'beforeResolver', { args: rawargs, requestContext }, options, schemaManager.getSchemas())
    const fields = getFields(entity, info)
    let filter = args.filter || undefined
    let parentFilter: ParentFilterResult | undefined
    if (parentEntity) {
      parentFilter = await getParentEntryFilter(entity, parentEntity, parent as unknown as Record<string, FilterValues>, schemaManager.getSchemas())
      if (filter) {
        filter = {
          _and: [
            filter,
            parentFilter?.filter
          ]
        }
      } else {
        filter = parentFilter?.filter
      }
    }
    const rawquery = {
      entityName: entity.name,
      fields,
      filter: filter as IFilter,
      relation: parentFilter?.relation,
      skip: args.skip as number,
      take: args.take as number
    }
    const { query, context: newContext } = await executeHook(entity, 'query', 'beforeSendQuery', { args, query: rawquery, context , requestContext}, options, schemaManager.getSchemas())
    
    let results = await sendQuery(typeof entity.connector === 'string' ? entity.connector : entity.connector.name, query as IQueryArgs)
    if (relationType === 'n:1') {
      results = (results as unknown[])[0]
    }
    const { results: modifiedResults } = await executeHook(
      entity,
      'query',
      'afterQueryResult',
      {
        args,
        query,
        results,
        context: newContext,
        requestContext,
      },
      options,
      schemaManager.getSchemas(),
    )

    return modifiedResults
  }
}

export function resolverCount<TSource, TContext, OptionsContext>(
  entity: IEntityInfo,
  schemaManager: SchemaManager<OptionsContext>,
  options: TSchemaOptions<OptionsContext>,
): GraphQLFieldResolver<TSource, TContext> {
  return async (parent, rawargs, requestContext) => {
    const { args, context } = await executeHook(entity, 'count', 'beforeResolver', { args: rawargs, requestContext }, options, schemaManager.getSchemas())

    const rawquery: IQueryArgs = {
      entityName: entity.name,
      count: true,
      fields: [],
      filter: args.filter as IFilter,
      skip: args.skip as number,
      take: args.take as number
    }

    const { query, context: newContext } = await executeHook(entity, 'count', 'beforeSendQuery', { args, query: rawquery, context, requestContext }, options, schemaManager.getSchemas())
    
    const results = await sendQuery(typeof entity.connector === 'string' ? entity.connector : entity.connector.name, query as IQueryArgs)
    const { results: modifiedResults } = await executeHook(
      entity,
      'count',
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
  }
}