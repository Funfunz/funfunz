import { buildDeleteMutationType, buildType } from './typeBuilder'
import config from '../utils/configLoader'
import type { IEntityInfo } from '../..//generator/configurationTypes'
import Debug from 'debug'
import { GraphQLFieldConfig, GraphQLFieldConfigMap, GraphQLList } from 'graphql'
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

export default function buildMutations(): GraphQLFieldConfigMap<unknown, TUserContext> {
  const configs = config()
  const mutations: GraphQLFieldConfigMap<unknown, TUserContext> = {}
  configs.settings.forEach((table) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const dataConnector = require(configs.config.connectors[table.connector].type)
    mutations[`add${capitalize(table.name)}`] = buildAddMutation(table, typeof dataConnector.addMutation === 'function' && dataConnector.addMutation(table))
    mutations[`update${capitalize(table.name)}`] = buildUpdateMutation(table, typeof dataConnector.updateMutation === 'function' && dataConnector.updateMutation(table))
    mutations[`delete${capitalize(table.name)}`] = buildDeleteMutation(table, typeof dataConnector.deleteMutation === 'function' && dataConnector.deleteMutation(table))
  })
  debug('Mutations built')
  return mutations
}

function buildUpdateMutation(table: IEntityInfo, dataConnectorMutation?: GraphQLFieldConfig<unknown, TUserContext>): GraphQLFieldConfig<unknown, TUserContext> {
  debug(`Creating ${table.name} update mutation`)
  const mutation: GraphQLFieldConfig<unknown, TUserContext>  = {
    type: dataConnectorMutation?.type || new GraphQLList(buildType(table, { relations: true })),
    args: dataConnectorMutation?.args || buildArgs(table, { pagination: true, data: true, filter: true }),
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

function buildAddMutation(table: IEntityInfo, dataConnectorMutation?: GraphQLFieldConfig<unknown, TUserContext>): GraphQLFieldConfig<unknown, TUserContext> {
  debug(`Creating ${table.name} add mutation`)
  const mutation: GraphQLFieldConfig<unknown, TUserContext>  = {
    type: dataConnectorMutation?.type || new GraphQLList(buildType(table)),
    args: dataConnectorMutation?.args || buildArgs(table, { data: true }),
    resolve: async (parent, rawargs, ctx, info) => {
      const { user } = ctx
      const { args, context } = await executeHook(table, 'add', 'beforeResolver', { args: rawargs, user })
      await requirementsCheck(table, 'create', user)
      console.log('After requirements')
      const data = normalize(args.data as Record<string, unknown>, table, true)
      console.log('After normaliza')
      const fields = getFields(table, info)

      const rawquery: ICreateArgs = {
        entityName: table.name,
        fields,
        data: data as Record<string, unknown>,
        skip: args.skip as number,
        take: args.take as number
      }
      console.log('After get fields')
      const { query, context: newContext } = await executeHook(table, 'add', 'beforeSendQuery', { user, args, query: rawquery, context })
      console.log('affer beforeSendQuery hook')
      const results = await create(table.connector, query as ICreateArgs)
      console.log('after connector')
      const { results: modifiedResults } = await executeHook(table, 'add', 'afterQueryResult', {
        user,
        args,
        query,
        results,
        context: newContext
      })
      console.log('results add mutation', results)
      return modifiedResults
    }
  }
  debug(`Created ${table.name} add mutation`)
  return mutation
}

function buildDeleteMutation(table: IEntityInfo, dataConnectorMutation?: GraphQLFieldConfig<unknown, TUserContext>): GraphQLFieldConfig<unknown, TUserContext> {
  debug(`Creating ${table.name} delete mutation`)
  const mutation: GraphQLFieldConfig<unknown, TUserContext>  = {
    type: dataConnectorMutation?.type || buildDeleteMutationType(table),
    args: dataConnectorMutation?.args || buildArgs(table, { filter: true }),
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
