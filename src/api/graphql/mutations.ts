'use strict'
import { buildAddMutationType, buildDeleteMutationType, buildInputType, capitalize, buildUpdateByIdMutationType, buildFields } from '@root/api/graphql/typeBuilder'
import config from '@root/api/utils/configLoader'
import { normalize as normalizeData } from '@root/api/utils/data'
import { ITableInfo } from '@root/configGenerator'
import Debug from 'debug'
import { applyQueryFilters, requirementsCheck, runHook, applyPKFilters } from '../utils'

const debug = Debug('funfunzmc:graphql-mutation-builder')

export default function buildMutations() {
  const configs = config()
  const mutations: {
    [key: string]: any
  } = {}
  configs.settings.forEach((table, index) => {
    mutations[`add${capitalize(table.name)}`] = buildAddMutation(table)
    mutations[`update${capitalize(table.name)}ById`] = buildUpdateByIdMutation(table)
    mutations[`delete${capitalize(table.name)}`] = buildDeleteMutation(table)
  })
  debug('Mutations built')
  return mutations
}

function buildUpdateByIdMutation(table: ITableInfo) {
  debug(`Creating ${table.name} updateById mutation`)
  const mutation = {
    type: buildUpdateByIdMutationType(table),
    resolve: (parent: any, args: any, context: any) => {
      return requirementsCheck(table, 'write', context.user).then((db) => {
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
        let QUERY = db(table.name)
        console.log('before query')
        const q = JSON.parse(JSON.stringify(args))
        table.pk.forEach((pk) => {
          q.pk[pk] = args[pk]
        })
        QUERY = applyPKFilters(QUERY, q, table)
        console.log('after query')
        return Promise.all([
          QUERY.update(data),
          db,
        ])
      }).then(([results, db]) => {
        return runHook(table, 'updateRow', 'after', context.req, context.res, db, results).then(() => db)
      }).then((db) => {
        let QUERY = db(table.name)
        const q = JSON.parse(JSON.stringify(args))
        table.pk.forEach((pk) => {
          q.pk[pk] = args[pk]
        })
        QUERY = applyPKFilters(QUERY, q, table)
        return QUERY.first()
      })
    },
    args: {
      ...buildFields(table, false),
    },
  }
  debug(`Created ${table.name} add mutation`)
  return mutation
}

function buildAddMutation(table: ITableInfo) {
  debug(`Creating ${table.name} add mutation`)
  const mutation = {
    type: buildAddMutationType(table),
    resolve: (parent: any, args: any, context: any) => {
      const query = { ...args.input }
      return requirementsCheck(table, 'write', context.user).then((db) => {
        const data = normalizeData(args.input, table)
        return Promise.all([
          db,
          runHook(table, 'insertRow', 'before', context.req, context.res, db, data),
        ])
      }).then(([db, data]) => {
        return Promise.all([
          db,
          db(table.name).insert(data).then((ids) => {
            if (ids[0]) {
              return db(table.name).where({ id: ids[0] }).first()
            } else {
              return db(table.name).where(query).first()
            }
          }),
        ])
      }).then(([db, results]) => {
        return runHook(table, 'insertRow', 'after', context.req, context.res, db, results)
      })
    },
    args: {
      input: { type: buildInputType(table) },
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
      return requirementsCheck(table, 'delete', context.user).then((db) => {
        return Promise.all([
          db,
          runHook(table, 'deleteRow', 'before', context.req, context.res, db),
        ])
      }).then(([db]) => {
        let QUERY = db(table.name)
        QUERY = applyQueryFilters(QUERY, args.input, table)
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
      input: { type: buildInputType(table) },
    },
  }
  debug(`Created ${table.name} delete mutation`)
  return mutation
}
