import { buildDeleteMutationType, buildType } from './typeBuilder'
import config from '../utils/configLoader'
import { ITableInfo } from '../..//generator/configurationTypes'
import Debug from 'debug'
import { GraphQLFieldConfig, GraphQLFieldConfigMap, Thunk } from 'graphql'
import { capitalize, getFields } from '../utils/index'
import { TUserContext } from './schema'
import { requirementsCheck } from '../utils/dataAccess'
import { runHook } from '../utils/lifeCycle'
import { normalize } from '../utils/data'
import { update, create, remove } from '../dataConnector/index'
import { buildArgs } from './argumentsBuilder'
import { connection } from '../dataConnector/index'

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
    resolve: (parent, args, context, info) => {
      return requirementsCheck(table, 'update', context.user).then(
        () => {
          const newData = normalize(args.data, table)
          return runHook(table, 'updateRow', 'before', context.req, context.res, connection(table.connector), newData)
        }
      ).then(
        (data) => {
          const fields = getFields(table, info)
          const filter = args.filter || undefined
          return update(
            table.connector,
            {
              entityName: table.name,
              fields,
              filter,
              data: data as Record<string, unknown>,
              skip: args.skip,
              take: args.take
            }
          )
        }
      ).then(
        (results) => {
          return runHook(table, 'updateRow', 'after', context.req, context.res, connection(table.connector), results)
        }
      )
    },
  }
  debug(`Created ${table.name} add mutation`)
  return mutation
}

function buildAddMutation(table: ITableInfo): GraphQLFieldConfig<unknown, TUserContext> {
  debug(`Creating ${table.name} add mutation`)
  const mutation: GraphQLFieldConfig<unknown, TUserContext>  = {
    type: buildType(table),
    args: buildArgs(table, { data: true }),
    resolve: (parent, args, context, info) => {
      return requirementsCheck(table, 'create', context.user).then(
        () => {
          const data = normalize(args.data, table, true)
          return runHook(table, 'insertRow', 'before', context.req, context.res, connection(table.connector), data)
        }
      ).then(
        (data) => {
          const fields = getFields(table, info)
          return create(
            table.connector,
            {
              entityName: table.name,
              fields,
              data: data as Record<string, unknown>,
              skip: args.skip,
              take: args.take
            }
          )
        }
      ).then(
        (results) => {
          return runHook(table, 'insertRow', 'after', context.req, context.res, connection(table.connector), results)
        }
      )
    },
  }
  debug(`Created ${table.name} add mutation`)
  return mutation
}

function buildDeleteMutation(table: ITableInfo): GraphQLFieldConfig<unknown, TUserContext> {
  debug(`Creating ${table.name} delete mutation`)
  const mutation: GraphQLFieldConfig<unknown, TUserContext>  = {
    type: buildDeleteMutationType(table),
    args: buildArgs(table, { filter: true }),
    resolve: (parent, args, context) => {
      return requirementsCheck(table, 'create', context.user).then(
        () => {
          return runHook(table, 'deleteRow', 'before', context.req, context.res, connection(table.connector))
        }
      ).then(
        () => {
          return remove(
            table.connector,
            {
              entityName: table.name,
              filter: args.filter
            }
          )
        }
      ).then(
        (results) => {
          return runHook(table, 'deleteRow', 'after', context.req, context.res, connection(table.connector), { deleted: results})
        }
      ).then(
        (result) => {
          return result
        }
      )
    },
  }
  debug(`Created ${table.name} delete mutation`)
  return mutation
}
