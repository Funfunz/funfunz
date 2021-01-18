import { query as sendQuery } from '../dataConnector/index'
import { getFields } from '../utils/index'
import { IEntityInfo } from '../../generator/configurationTypes'
import { GraphQLFieldResolver } from 'graphql'
import { getParentEntryFilter, FilterValues, ParentFilterResult, IFilter } from '../utils/filter'
import { executeHook } from '../utils/lifeCycle'
import { IQueryArgs } from '../../types/connector'
import type { SchemaManager, TSchemaOptions } from './manager'

export function resolver<SchemaOptions>(
  table: IEntityInfo,
  schemaManager: SchemaManager<SchemaOptions>,
  options: TSchemaOptions<SchemaOptions>,
  parentTable?: IEntityInfo,
  relationType?: '1:n' | 'n:1' | 'm:n',
): GraphQLFieldResolver<unknown, unknown> {
  return async (parent, rawargs, requestContext, info) => {
    const { args, context } = await executeHook(table, 'query', 'beforeResolver', { args: rawargs, requestContext }, options, schemaManager.getSchemas())
    const fields = getFields(table, info)
    let filter = args.filter || undefined
    let parentFilter: ParentFilterResult | undefined
    if (parentTable) {
      parentFilter = await getParentEntryFilter(table, parentTable, parent as unknown as Record<string, FilterValues>, schemaManager.getSchemas())
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
      entityName: table.name,
      fields,
      filter: filter as IFilter,
      relation: parentFilter?.relation,
      skip: args.skip as number,
      take: args.take as number
    }
    const { query, context: newContext } = await executeHook(table, 'query', 'beforeSendQuery', { args, query: rawquery, context , requestContext}, options, schemaManager.getSchemas())
    
    let results = await sendQuery(table.connector, query as IQueryArgs)
    if (relationType === 'n:1') {
      results = (results as unknown[])[0]
    }
    const { results: modifiedResults } = await executeHook(
      table,
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
  table: IEntityInfo,
  schemaManager: SchemaManager<OptionsContext>,
  options: TSchemaOptions<OptionsContext>,
): GraphQLFieldResolver<TSource, TContext> {
  return async (parent, rawargs, requestContext) => {
    const { args, context } = await executeHook(table, 'count', 'beforeResolver', { args: rawargs, requestContext }, options, schemaManager.getSchemas())

    const rawquery: IQueryArgs = {
      entityName: table.name,
      count: true,
      fields: [],
      filter: args.filter as IFilter,
      skip: args.skip as number,
      take: args.take as number
    }

    const { query, context: newContext } = await executeHook(table, 'count', 'beforeSendQuery', { args, query: rawquery, context, requestContext }, options, schemaManager.getSchemas())
    
    const results = await sendQuery(table.connector, query as IQueryArgs)
    const { results: modifiedResults } = await executeHook(
      table,
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