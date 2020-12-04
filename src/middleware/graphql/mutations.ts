import { buildDeleteMutationType, buildType } from './typeBuilder'
import config from '../utils/configLoader'
import Debug from 'debug'
import { GraphQLFieldConfig, GraphQLFieldConfigMap, GraphQLList } from 'graphql'
import { capitalize, getFields } from '../utils/index'
import { TUserContext } from './schema'
import { executeHook } from '../utils/lifeCycle'
import { normalize } from '../utils/data'
import { update, create, remove } from '../dataConnector/index'
import { buildArgs } from './argumentsBuilder'
import type { ICreateArgs, IRemoveArgs, IUpdateArgs } from '../../types/connector'
import type { IFilter } from '../utils/filter'
import type { IEntityInfo } from '../..//generator/configurationTypes'
import type { Funfunz } from '../index'

const debug = Debug('funfunz:graphql-mutation-builder')

export default function buildMutations(funfunz: Funfunz): GraphQLFieldConfigMap<unknown, TUserContext> {
  const configs = config()
  const mutations: GraphQLFieldConfigMap<unknown, TUserContext> = {}
  configs.settings.forEach((table) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const dataConnector = require(configs.config.connectors[table.connector].type)
    mutations[`add${capitalize(table.name)}`] = buildAddMutation(table, funfunz, typeof dataConnector.addMutation === 'function' && dataConnector.addMutation(table))
    mutations[`update${capitalize(table.name)}`] = buildUpdateMutation(table, funfunz, typeof dataConnector.updateMutation === 'function' && dataConnector.updateMutation(table))
    mutations[`delete${capitalize(table.name)}`] = buildDeleteMutation(table, funfunz, typeof dataConnector.deleteMutation === 'function' && dataConnector.deleteMutation(table))
  })
  debug('Mutations built')
  return mutations
}

function buildUpdateMutation(
  table: IEntityInfo,
  funfunz: Funfunz,
  dataConnectorMutation?: GraphQLFieldConfig<unknown, TUserContext>
): GraphQLFieldConfig<unknown, TUserContext> {
  debug(`Creating ${table.name} update mutation`)
  const mutation: GraphQLFieldConfig<unknown, TUserContext>  = {
    type: dataConnectorMutation?.type || new GraphQLList(buildType(table, funfunz, { relations: true })),
    args: dataConnectorMutation?.args || buildArgs(table, { pagination: true, data: true, filter: true }),
    resolve: async (parent, rawargs, { req, res }, info) => {
      const { args, context } = await executeHook(table, 'update', 'beforeResolver', { args: rawargs, req, res }, funfunz)
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
      const { query, context: newContext } = await executeHook(table, 'update', 'beforeSendQuery', { req, res, args, query: rawquery, context }, funfunz)
      
      const results = await update(table.connector, query as IUpdateArgs)
      
      const { results: modifiedResults } = await executeHook(
        table,
        'update',
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
  debug(`Created ${table.name} add mutation`)
  return mutation
}

function buildAddMutation(
  table: IEntityInfo,
  funfunz: Funfunz,
  dataConnectorMutation?: GraphQLFieldConfig<unknown, TUserContext>
): GraphQLFieldConfig<unknown, TUserContext> {
  debug(`Creating ${table.name} add mutation`)
  const mutation: GraphQLFieldConfig<unknown, TUserContext>  = {
    type: dataConnectorMutation?.type || new GraphQLList(buildType(table, funfunz)),
    args: dataConnectorMutation?.args || buildArgs(table, { data: true }),
    resolve: async (parent, rawargs, { req, res }, info) => {
      const { args, context } = await executeHook(table, 'add', 'beforeResolver', { args: rawargs, req, res }, funfunz)
      const data = normalize(args.data as Record<string, unknown>, table, true)
      const fields = getFields(table, info)

      const rawquery: ICreateArgs = {
        entityName: table.name,
        fields,
        data: data as Record<string, unknown>,
        skip: args.skip as number,
        take: args.take as number
      }
      const { query, context: newContext } = await executeHook(table, 'add', 'beforeSendQuery', { req, res, args, query: rawquery, context }, funfunz)
      const results = await create(table.connector, query as ICreateArgs)
      const { results: modifiedResults } = await executeHook(
        table,
        'add',
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
  debug(`Created ${table.name} add mutation`)
  return mutation
}

function buildDeleteMutation(
  table: IEntityInfo,
  funfunz: Funfunz,
  dataConnectorMutation?: GraphQLFieldConfig<unknown, TUserContext>,
): GraphQLFieldConfig<unknown, TUserContext> {
  debug(`Creating ${table.name} delete mutation`)
  const mutation: GraphQLFieldConfig<unknown, TUserContext>  = {
    type: dataConnectorMutation?.type || buildDeleteMutationType(table),
    args: dataConnectorMutation?.args || buildArgs(table, { filter: true }),
    resolve: async (parent, rawargs, { req, res }) => {
      const { args, context } = await executeHook(table, 'delete', 'beforeResolver', { args: rawargs, req, res }, funfunz)
      const rawquery: IRemoveArgs = {
        entityName: table.name,
        filter: args.filter as IFilter
      }
      const { query, context: newContext } = await executeHook(table, 'delete', 'beforeSendQuery', { req, res, args, query: rawquery, context }, funfunz)

      const deleted = await remove(table.connector, query as IRemoveArgs)
      const results = { deleted }

      const { results: modifiedResults } = await executeHook(
        table,
        'delete',
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
    },
  }
  debug(`Created ${table.name} delete mutation`)
  return mutation
}
