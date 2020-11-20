import { query as sendQuery } from '../dataConnector/index'
import { getFields } from '../utils/index'
import { IEntityInfo } from '../../generator/configurationTypes'
import { GraphQLFieldResolver } from 'graphql'
import { TUserContext } from './schema'
import { requirementsCheck } from '../utils/dataAccess'
import { getParentEntryFilter, FilterValues, ParentFilterResult, IFilter } from '../utils/filter'
import { executeHook } from '../utils/lifeCycle'
import { IQueryArgs } from '../../types/connector'

export function resolver<TSource, TContext extends TUserContext>(
  table: IEntityInfo,
  parentTable?: IEntityInfo,
  relationType?: '1:n' | 'n:1' | 'm:n'
): GraphQLFieldResolver<TSource, TContext> {
  return async (parent, rawargs, ctx, info) => {
    const { user, superUser } = ctx
    const { args, context } = await executeHook(table, 'query', 'beforeResolver', { args: rawargs, user })
    await requirementsCheck(table, 'read', user, superUser)
    const fields = getFields(table, info)
    let filter = args.filter || undefined
    let parentFilter: ParentFilterResult | undefined
    if (parentTable) {
      parentFilter = await getParentEntryFilter(table, parentTable, parent as unknown as Record<string, FilterValues>)
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
    const { query, context: newContext } = await executeHook(table, 'query', 'beforeSendQuery', { user, args, query: rawquery, context })
    
    let results = await sendQuery(table.connector, query as IQueryArgs)
    if (relationType === 'n:1') {
      results = (results as unknown[])[0]
    }
    const { results: modifiedResults } = await executeHook(table, 'query', 'afterQueryResult', {
      user,
      args,
      query,
      results,
      context: newContext
    })

    return modifiedResults
  }
}

export function resolverCount<TSource, TContext extends TUserContext>(
  table: IEntityInfo
): GraphQLFieldResolver<TSource, TContext> {
  return async (parent, rawargs, ctx) => {
    const { user, superUser } = ctx

    const { args, context } = await executeHook(table, 'count', 'beforeResolver', { args: rawargs, user })

    await requirementsCheck(table, 'read', user, superUser)

    const rawquery: IQueryArgs = {
      entityName: table.name,
      count: true,
      fields: [],
      filter: args.filter as IFilter,
      skip: args.skip as number,
      take: args.take as number
    }

    const { query, context: newContext } = await executeHook(table, 'count', 'beforeSendQuery', { user, args, query: rawquery, context })
    
    const results = await sendQuery(table.connector, query as IQueryArgs)
    const { results: modifiedResults } = await executeHook(table, 'count', 'afterQueryResult', {
      user,
      args,
      query,
      results,
      context: newContext
    })

    return modifiedResults
  }
}