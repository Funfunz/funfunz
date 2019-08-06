import database from '@root/api/db'
import { IColumnInfo, ITableInfo } from '@root/configGenerator'
import Bluebird from 'bluebird'
import { GraphQLResolveInfo } from 'graphql'
import { applyQueryFilters } from '@root/api/utils';
import { singular } from 'pluralize';

function getFields(table: ITableInfo, info: GraphQLResolveInfo): string[] {
  let fields = table.pk

  if (info.fieldNodes[0].selectionSet) {
    fields = []
    info.fieldNodes[0].selectionSet.selections.forEach(
      (selection: any) => {
        const columnName = selection.name.value
        if (table.columns.find((c) => c.name === columnName)) {
          fields.push(columnName)
        } else {
          const column = table.columns.find((c) => {
            return (c.relation && c.relation.type === 'oneToMany' &&
              singular(c.relation.table) === columnName) ? true : false
          })
          if (column) {
            fields.push(column.name)
          }
        }
      }
    )
  }

  return fields
}

export function resolverById(table: ITableInfo, column: IColumnInfo) {
  return (parent: any, args: any, context: any, info: GraphQLResolveInfo) => {
    if (!database.db || !column.relation) {
      return {}
    }

    if (parent[column.name] === null || parent[column.name] === '') {
      return null
    }

    if (typeof parent[column.name] === 'object') {
      return parent[column.name]
    }
    const query = database
    .db(column.relation.table)
    .select(getFields(table, info))
    .where({ id: parent[column.name]})

    return query
    .then(
      (res) => {
        return res[0] || {}
      }
    )
  }
}

export function resolver(table: ITableInfo) {
  return (parent: any, args: any, context: any, info: GraphQLResolveInfo) => {
    if (!database.db) {
      return {}
    }

    const DB = database.db

    const fields = getFields(table, info)
    let QUERY = DB(table.name).select(fields)
    QUERY = applyQueryFilters(QUERY, args, table)
    return QUERY.then(
      (res) => {
        const promises: Array<Bluebird<any>> = []
        table.columns.forEach(
          (column) => {
            if (column.relation && fields.indexOf(column.name) !== -1) {
              const values = res.map(
                (row: any) => row[column.name]
              )
              promises.push(
                DB(column.relation.table).select().whereIn(column.relation.key, values).then(
                  (relationResponse) => ({
                    results: relationResponse,
                    column,
                  })
                )
              )
            }
          }
        )
        return Promise.all([
          res,
          Promise.all(promises),
        ])
      }
    ).then(
      ([result, relations]) => {
        const results =  result.map(
          (row: any) => {
            relations.forEach(
              (relation) => {
                row[relation.column.name] = relation.results.find(
                  (relationRow: any) => relationRow.id === row[relation.column.name]
                ) || row[relation.column.name]
              }
            )
            return row
          }
        )
        return results
      }
    )
  }
}
