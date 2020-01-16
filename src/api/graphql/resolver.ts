import database from '@root/api/db'
import { applyParentTableFilters, applyQueryFilters, requirementsCheck, getPKs } from '@root/api/utils'
import { ITableInfo } from '@root/generator/configurationTypes'
import { GraphQLResolveInfo } from 'graphql'

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
  return fields
}

export function resolver(table: ITableInfo, parentTable?: ITableInfo) {
  return (parent: any, args: any, context: any, info: GraphQLResolveInfo) => {
    return requirementsCheck(table, 'read', context.user, database).then((DB) => {
      const fields = getFields(table, info)
      let QUERY = DB(table.name).select(fields)
      QUERY = applyQueryFilters(QUERY, args, table)
      if (parentTable) {
        return applyParentTableFilters(QUERY, table, parentTable, parent)
      } else {
        return QUERY
      }
    })
  }
}
