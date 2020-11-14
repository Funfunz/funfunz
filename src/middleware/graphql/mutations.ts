import { buildDeleteMutationType, buildType } from './typeBuilder'
import config from '../utils/configLoader'
import { ITableInfo } from '../..//generator/configurationTypes'
import Debug from 'debug'
import { GraphQLFieldConfig, GraphQLFieldConfigMap, Thunk } from 'graphql'
import { capitalize, getFields } from '../utils/index'
import { TUserContext } from './schema'
import { requirementsCheck } from '../utils/dataAccess'
import { executeHook } from '../utils/lifeCycle'
import { normalize } from '../utils/data'
import { update, create, remove } from '../dataConnector/index'
import { buildArgs } from './argumentsBuilder'
import { ICreateArgs, IRemoveArgs, IUpdateArgs } from '../../types/connector'
import { IFilter } from '../utils/filter'

const debug = Debug('funfunz:graphql-mutation-builder')

export default function buildMutations(): Thunk<GraphQLFieldConfigMap<unknown, TUserContext>> {
  const configs = config()
  const mutations: Thunk<GraphQLFieldConfigMap<unknown, TUserContext>> = {}
  configs.settings.forEach((table) => {
    mutations[`add${capitalize(table.name)}`] = buildAddMutation(table)
    mutations[`update${capitalize(table.name)}`] = buildUpdateByIdMutation(table)
    mutations[`delete${capitalize(table.name)}`] = buildDeleteMutation(table)
  })
  debug('Mutations built')
  return mutations
}

function buildUpdateByIdMutation(table: ITableInfo): GraphQLFieldConfig<unknown, TUserContext> {
  debug(`Creating ${table.name} update mutation`)
  const mutation: GraphQLFieldConfig<unknown, TUserContext>  = {
    type: buildType(table, { relations: true }),
    args: buildArgs(table, { pagination: true, data: true, filter: true }),
    resolve: async (parent, rawargs, ctx, info) => {
      const { user } = ctx
      const { args, context } = await executeHook(table, 'update', 'beforeResolver', { args: rawargs, user })
      await requirementsCheck(table, 'update', user)
      const data = normalize(args.data as Record<string, unknown>, table)
      const fields = getFields(table, info)
      const filter = args.filter || undefined
      const rawquery = {
        entityName: table.name,
        fields,
        filter: filter as IFilter,
        data: data as Record<string, unknown>,
        skip: args.skip,
        take: args.take
      }
      const { query, context: newContext } = await executeHook(table, 'update', 'beforeSendQuery', { user, args, query: rawquery, context })
      
      const results = await update(table.connector, query as IUpdateArgs)
      
      const { results: modifiedResults } = await executeHook(table, 'update', 'afterQueryResult', {
        user,
        args,
        query,
        results,
        context: newContext
      })
      return modifiedResults
    }
  }
  debug(`Created ${table.name} add mutation`)
  return mutation
}

function buildAddMutation(table: ITableInfo): GraphQLFieldConfig<unknown, TUserContext> {
  debug(`Creating ${table.name} add mutation`)
  const mutation: GraphQLFieldConfig<unknown, TUserContext>  = {
    type: buildType(table),
    args: buildArgs(table, { data: true }),
    resolve: async (parent, rawargs, ctx, info) => {
      const { user } = ctx
      const { args, context } = await executeHook(table, 'add', 'beforeResolver', { args: rawargs, user })
      await requirementsCheck(table, 'create', user)
      const data = normalize(args.data as Record<string, unknown>, table, true)
      const fields = getFields(table, info)

      const rawquery = {
        entityName: table.name,
        fields,
        data: data as Record<string, unknown>,
        skip: args.skip as number,
        take: args.take as number
      }

      const { query, context: newContext } = await executeHook(table, 'add', 'beforeSendQuery', { user, args, query: rawquery, context })
    
      const results = await create(table.connector, query as ICreateArgs)
      
      const { results: modifiedResults } = await executeHook(table, 'add', 'afterQueryResult', {
        user,
        args,
        query,
        results,
        context: newContext
      })
      return modifiedResults
    }
  }
  debug(`Created ${table.name} add mutation`)
  return mutation
}

function buildDeleteMutation(table: ITableInfo): GraphQLFieldConfig<unknown, TUserContext> {
  debug(`Creating ${table.name} delete mutation`)
  const mutation: GraphQLFieldConfig<unknown, TUserContext>  = {
    type: buildDeleteMutationType(table),
    args: buildArgs(table, { filter: true }),
    resolve: async (parent, rawargs, ctx) => {
      const { user } = ctx
      const { args, context } = await executeHook(table, 'delete', 'beforeResolver', { args: rawargs, user })
      await requirementsCheck(table, 'create', user)
      const rawquery: IRemoveArgs = {
        entityName: table.name,
        filter: args.filter as IFilter
      }
      const { query, context: newContext } = await executeHook(table, 'delete', 'beforeSendQuery', { user, args, query: rawquery, context })

      const deleted = await remove(table.connector, query as IRemoveArgs)
      const results = { deleted }

      const { results: modifiedResults } = await executeHook(table, 'delete', 'afterQueryResult', {
        user,
        args,
        query,
        results,
        context: newContext
      })
      return modifiedResults
    },
  }
  debug(`Created ${table.name} delete mutation`)
  return mutation
}
