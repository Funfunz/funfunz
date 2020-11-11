import { query as sendQuery } from '../dataConnector/index'
import { getFields } from '../utils/index'
import { ITableInfo } from '../../generator/configurationTypes'
import { GraphQLFieldResolver } from 'graphql'
import { TUserContext } from './schema'
import { requirementsCheck } from '../utils/dataAccess'
import { getParentEntryFilter, FilterValues, ParentFilterResult, IFilter } from '../utils/filter'
import { executeHook } from '../utils/lifeCycle'
import { IQueryArgs } from '../../types/connector'

export function resolver<TSource, TContext extends TUserContext>(
  table: ITableInfo,
  parentTable?: ITableInfo
): GraphQLFieldResolver<TSource, TContext> {
  return async (parent, rawargs, ctx, info) => {
    const { user, superUser } = ctx
    const { args, context } = await executeHook(table, 'query', 'beforeResolver', { args: rawargs, user })
    return await requirementsCheck(table, 'read', user, superUser).then(
      async () => {
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
        
        const results = await sendQuery(table.connector, query as IQueryArgs)
        
        await executeHook(table, 'query', 'beforeSendQuery', {
          user,
          args,
          query,
          results,
          context: newContext
        })

        return results
      }
    )
  }
}

export function resolverCount<TSource, TContext extends TUserContext>(
  table: ITableInfo
): GraphQLFieldResolver<TSource, TContext> {
  return (parent, args, context) => {
    return requirementsCheck(table, 'read', context.user, context.superUser).then(
      async () => {
        return query(
          table.connector,
          {
            entityName: table.name,
            count: true,
            filter: args.filter,
            skip: args.skip,
            take: args.take
          }
        )
      }
    )
  }
}