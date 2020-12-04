import { query as sendQuery } from '../dataConnector/index'
import { getFields } from '../utils/index'
import { IEntityInfo } from '../../generator/configurationTypes'
import { GraphQLFieldResolver } from 'graphql'
import { TUserContext } from './schema'
import { requirementsCheck } from '../utils/dataAccess'
import { getParentEntryFilter, FilterValues, ParentFilterResult, IFilter } from '../utils/filter'
import { executeHook } from '../utils/lifeCycle'
import { IQueryArgs } from '../../types/connector'
import { Funfunz } from '..'

export function resolver<TSource, TContext extends TUserContext>(
  table: IEntityInfo,
  funfunz: Funfunz,
  parentTable?: IEntityInfo,
  relationType?: '1:n' | 'n:1' | 'm:n',
): GraphQLFieldResolver<TSource, TContext> {
  return async (parent, rawargs, { req, res }, info) => {
    const { args, context } = await executeHook(table, 'query', 'beforeResolver', { args: rawargs, req, res }, funfunz)
    const fields = getFields(table, info)
    let filter = args.filter || undefined
    let parentFilter: ParentFilterResult | undefined
    if (parentTable) {
      parentFilter = await getParentEntryFilter(table, parentTable, parent as unknown as Record<string, FilterValues>, funfunz)
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
    const { query, context: newContext } = await executeHook(table, 'query', 'beforeSendQuery', { req, res, args, query: rawquery, context }, funfunz)
    
    let results = await sendQuery(table.connector, query as IQueryArgs)
    if (relationType === 'n:1') {
      results = (results as unknown[])[0]
    }
    const { results: modifiedResults } = await executeHook(
      table,
      'query',
      'afterQueryResult',
      {
        req,
        res,
        args,
        query,
        results,
        context: newContext
      },
      funfunz
    )

    return modifiedResults
  }
}

export function resolverCount<TSource, TContext extends TUserContext>(
  table: IEntityInfo,
  funfunz: Funfunz
): GraphQLFieldResolver<TSource, TContext> {
  return async (parent, rawargs, { req, res }) => {
    const { args, context } = await executeHook(table, 'count', 'beforeResolver', { args: rawargs, req, res }, funfunz)

    const rawquery: IQueryArgs = {
      entityName: table.name,
      count: true,
      fields: [],
      filter: args.filter as IFilter,
      skip: args.skip as number,
      take: args.take as number
    }

    const { query, context: newContext } = await executeHook(table, 'count', 'beforeSendQuery', { req, res, args, query: rawquery, context }, funfunz)
    
    const results = await sendQuery(table.connector, query as IQueryArgs)
    const { results: modifiedResults } = await executeHook(
      table,
      'count',
      'afterQueryResult',
      {
        req,
        res,
        args,
        query,
        results,
        context: newContext
      },
      funfunz
    )

    return modifiedResults
  }
}