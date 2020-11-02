'use strict'
import database from '../db'
import { buildDeleteMutationType, buildFields, buildType, capitalize } from './typeBuilder'
import config from '../utils/configLoader'
import { normalize as normalizeData } from '../utils/data'
import { ITableInfo } from '../..//generator/configurationTypes'
import Debug from 'debug'
import { GraphQLFieldConfig, GraphQLFieldConfigArgumentMap, GraphQLFieldConfigMap, Thunk } from 'graphql'
import { applyQueryFilters, getPKs, requirementsCheck, runHook } from '../utils'
import { resolver } from './resolver'
import { TUserContext } from './schema'

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
    resolve: (parent, args, context, info) => {
      return requirementsCheck(table, 'update', context.user, database).then((db) => {
        const newData = normalizeData(args, table)
        return Promise.all([
          db,
          runHook(table, 'updateRow', 'before', context.req, context.res, db, newData),
        ])
      }).then(([db, data]) => {
        let SQL = db(table.name)
        const query = {}
        getPKs(table).forEach((pk) => {
          query[pk] = {
            $eq: isNaN(args[pk]) ? args[pk] : Number(args[pk])
          }
        })
        SQL = applyQueryFilters(SQL, query)
        console.log('BEFORE UPDATE: ', data)
        return Promise.all([
          db,
          SQL.update(data as Record<string, unknown>).then(() => {
            return resolver(table)(parent, query, context, info)
          }),
        ])
      }).then(([db, results]) => {
        return runHook(table, 'updateRow', 'after', context.req, context.res, db, results && results[0])
      })
    },
    args: {
      ...buildFields(table, { relations: false, required: ['pk'] }) as GraphQLFieldConfigArgumentMap,
    },
  }
  debug(`Created ${table.name} add mutation`)
  return mutation
}

function buildAddMutation(table: ITableInfo): GraphQLFieldConfig<unknown, TUserContext> {
  debug(`Creating ${table.name} add mutation`)
  const mutation: GraphQLFieldConfig<unknown, TUserContext>  = {
    type: buildType(table),
    resolve: (parent, args, context, info) => {
      return requirementsCheck(table, 'create', context.user, database).then((db) => {
        const data = normalizeData(args, table, true)
        return Promise.all([
          db,
          runHook(table, 'insertRow', 'before', context.req, context.res, db, data),
        ])
      }).then(
        ([db, data]) => {
          return Promise.all([
            db,
            db(table.name).insert(data as Record<string, unknown>).then((ids) => {
              const query = {}
              getPKs(table).forEach((key, index) => {
                query[key] = args[key] || ids[index]
              })
              return resolver(table)(parent, query, context, info)
            }),
          ])
        }
      ).then(
        ([db, results]) => {
          return runHook(table, 'insertRow', 'after', context.req, context.res, db || null, results && results[0])
        }
      )
    },
    args: {
      ...buildFields(table, { relations: false }) as GraphQLFieldConfigArgumentMap,
    },
  }
  debug(`Created ${table.name} add mutation`)
  return mutation
}

function buildDeleteMutation(table: ITableInfo): GraphQLFieldConfig<unknown, TUserContext> {
  debug(`Creating ${table.name} delete mutation`)
  const mutation: GraphQLFieldConfig<unknown, TUserContext>  = {
    type: buildDeleteMutationType(table),
    resolve: (parent, args, context) => {
      return requirementsCheck(table, 'delete', context.user, database).then((db) => {
        return Promise.all([
          db,
          runHook(table, 'deleteRow', 'before', context.req, context.res, db),
        ])
      }).then(([db]) => {
        let QUERY = db(table.name)
        const query = {}
        getPKs(table).forEach((pk) => {
          query[pk] = {
            $eq: isNaN(args[pk]) ? args[pk] : Number(args[pk])
          }
        })
        QUERY = applyQueryFilters(QUERY, query)
        return Promise.all([
          Promise.resolve(db),
          QUERY.del(),
        ])
      }).then(([db, results]) => {
        return runHook(table, 'deleteRow', 'after', context.req, context.res, db, { deleted: results})
      }).then((result) => {
        return { success: !!result }
      })
    },
    args: {
      ...buildFields(table, { relations: false, include: ['pk'], required: ['pk'] }) as GraphQLFieldConfigArgumentMap,
    },
  }
  debug(`Created ${table.name} delete mutation`)
  return mutation
}
