'use strict'
import database from '@root/api/db'
import { buildDeleteMutationType, buildFields, buildType, capitalize } from '@root/api/graphql/typeBuilder'
import config from '@root/api/utils/configLoader'
import { normalize as normalizeData } from '@root/api/utils/data'
import { ITableInfo } from '@root/generator/configurationTypes'
import Debug from 'debug'
import { GraphQLResolveInfo } from 'graphql'
import Knex from 'knex'
import { applyQueryFilters, requirementsCheck, runHook } from '../utils'
import { resolver } from './resolver'

const debug = Debug('funfunzmc:graphql-mutation-builder')

export default function buildMutations() {
  const configs = config()
  const mutations: {
    [key: string]: any
  } = {}
  configs.settings.forEach((table) => {
    mutations[`add${capitalize(table.name)}`] = buildAddMutation(table)
    mutations[`update${capitalize(table.name)}`] = buildUpdateByIdMutation(table)
    mutations[`delete${capitalize(table.name)}`] = buildDeleteMutation(table)
  })
  debug('Mutations built')
  return mutations
}

function buildUpdateByIdMutation(table: ITableInfo) {
  debug(`Creating ${table.name} update mutation`)
  const mutation = {
    type: buildType(table, { relations: true }),
    resolve: (parent: any, args: any, context: any, info: GraphQLResolveInfo) => {
      return requirementsCheck(table, 'write', context.user, database).then((db) => {
        const acceptedColumns: string[] = []
        table.columns.forEach((column) => {
          if (column.type === 'datetime') {
            args[column.name] = new Date(args[column.name] || null)
          }
          if (args[column.name] !== undefined) {
            acceptedColumns.push(column.name)
          }
        })
        const newData = normalizeData(args, table)
        return Promise.all([
          db,
          runHook(table, 'updateRow', 'before', context.req, context.res, db, newData),
        ])
      }).then(([db, data]) => {
        let SQL = db(table.name)
        const query: any = {}
        table.pk.forEach((pk) => {
          query[pk] = isNaN(args[pk]) ? args[pk] : Number(args[pk])
        })
        SQL = applyQueryFilters(SQL, query, table)
        return Promise.all([
          db,
          SQL.update(data).then(() => {
            return resolver(table)(parent, query, context, info)
          }),
        ])
      }).then(([db, results]) => {
        return runHook(table, 'updateRow', 'after', context.req, context.res, db, results && results[0])
      })
    },
    args: {
      ...buildFields(table, { relations: false, required: ['pk'] }),
    },
  }
  debug(`Created ${table.name} add mutation`)
  return mutation
}

function buildAddMutation(table: ITableInfo) {
  debug(`Creating ${table.name} add mutation`)
  const mutation = {
    type: buildType(table),
    resolve: (parent: any, args: any, context: any, info: GraphQLResolveInfo) => {
      return requirementsCheck(table, 'write', context.user, database).then((db) => {
        const data = normalizeData(args, table)
        return Promise.all([
          db,
          runHook(table, 'insertRow', 'before', context.req, context.res, db, data),
        ])
      })
      .then(([db, data]: [Knex<any, any[]>, any]) => {
        return Promise.all([
          db,
          db(table.name).insert(data).then((ids) => {
            const query: any = {}
            table.pk.forEach((key, index) => {
              query[key] = args[key] || ids[index]
            })
            return resolver(table)(parent, query, context, info)
          }),
        ])
      }).then(([db, results]) => {
        return runHook(table, 'insertRow', 'after', context.req, context.res, db, results && results[0])
      })
    },
    args: {
      ...buildFields(table, { relations: false }),
    },
  }
  debug(`Created ${table.name} add mutation`)
  return mutation
}

function buildDeleteMutation(table: ITableInfo) {
  debug(`Creating ${table.name} delete mutation`)
  const mutation = {
    type: buildDeleteMutationType(table),
    resolve: (parent: any, args: any, context: any) => {
      return requirementsCheck(table, 'delete', context.user, database).then((db) => {
        return Promise.all([
          db,
          runHook(table, 'deleteRow', 'before', context.req, context.res, db),
        ])
      }).then(([db]) => {
        let QUERY = db(table.name)
        QUERY = applyQueryFilters(QUERY, args, table)
        return Promise.all([
          Promise.resolve(db),
          QUERY.del(),
        ])
      }).then(([db, results]) => {
        return runHook(table, 'deleteRow', 'after', context.req, context.res, db, results)
      }).then((result) => {
        return { success: !!result }
      })
    },
    args: {
      ...buildFields(table, { relations: false, include: ['pk'], required: ['pk'] }),
    },
  }
  debug(`Created ${table.name} delete mutation`)
  return mutation
}
