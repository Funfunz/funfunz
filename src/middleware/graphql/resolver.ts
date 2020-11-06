import { query } from '../dataConnector/index'
import { getFields } from '../utils/index'
import { ITableInfo } from '../../generator/configurationTypes'
import { GraphQLFieldResolver } from 'graphql'
import { TUserContext } from './schema'
import { requirementsCheck } from '../utils/dataAccess'
import { getParentEntryFilter, FilterValues, ParentFilterResult } from '../utils/filter'

export function resolver<TSource, TContext extends TUserContext>(
  table: ITableInfo,
  parentTable?: ITableInfo
): GraphQLFieldResolver<TSource, TContext> {
  return (parent, args, context, info) => {
    return requirementsCheck(table, 'read', context.user).then(
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
        return query(
          table.connector,
          {
            entityName: table.name,
            fields,
            filter,
            relation: parentFilter?.relation,
            skip: args.skip,
            take: args.take
          }
        )
      }
    )
  }
}

export function resolverCount<TSource, TContext extends TUserContext>(
  table: ITableInfo
): GraphQLFieldResolver<TSource, TContext> {
  return (parent, args, context) => {
    return requirementsCheck(table, 'read', context.user).then(
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