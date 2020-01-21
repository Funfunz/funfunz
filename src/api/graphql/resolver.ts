import database from '@root/api/db'
import { applyParentTableFilters, applyQueryFilters, requirementsCheck, getPKs } from '@root/api/utils'
import { ITableInfo } from '@root/generator/configurationTypes'
import { GraphQLResolveInfo } from 'graphql'
import Knex from 'knex'

function getFields(table: ITableInfo, info: GraphQLResolveInfo): string[] {
  const fields = [...(getPKs(table))]

  if (info.fieldNodes[0].selectionSet) {
    info.fieldNodes[0].selectionSet.selections.forEach(
      (selection: any) => {
        const columnName = selection.name.value
        if (table.columns.find((c) => c.name === columnName)) {
          fields.push(columnName)
        }
        const relation = table.relations && table.relations.find((r) => {
          return r.remoteTable === columnName && r.relationalTable === table.name
        })
        if (relation) {
          fields.push(relation.foreignKey)
        }
      }
    )
  }
  return [...new Set(fields)]
}

export function resolver(table: ITableInfo, parentTable?: ITableInfo) {
  return (parent: any, args: any, context: any, info: GraphQLResolveInfo) => {
    return requirementsCheck(table, 'read', context.user, database).then((DB) => {
      const fields = getFields(table, info)
      let QUERY = DB(table.name).select(fields)
      const queryFilters: any = {}
      for (const key in args) {
        if (key !== 'limit' && key !== 'offset') {
          queryFilters[key] = args[key]
        }
      }
      QUERY = applyQueryFilters(QUERY, queryFilters, table)
      paginate(QUERY, args.offset, args.limit)
      if (parentTable) {
        return applyParentTableFilters(QUERY, table, parentTable, parent)
      } else {
        return QUERY
      }
    })
  }
}

function paginate(query: Knex.QueryBuilder, offset = 0, limit = 10) {
  offset = typeof offset === 'string' ? parseInt(offset, 10) : offset
  limit = typeof limit === 'string' ? parseInt(limit, 10) : limit
  if (limit > 0) {
    query.offset((offset) * limit).limit(limit)
  }
  return query
}