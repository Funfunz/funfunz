import database from '@root/api/db'
import { applyParentTableFilters, applyQueryFilters, requirementsCheck } from '@root/api/utils'
import { ITableInfo } from '@root/generator/configurationTypes'
import { GraphQLResolveInfo } from 'graphql'

function getFields(table: ITableInfo, info: GraphQLResolveInfo): string[] {
  const fields = [...table.pk]

  if (info.fieldNodes[0].selectionSet) {
    info.fieldNodes[0].selectionSet.selections.forEach(
      (selection: any) => {
        const columnName = selection.name.value
        if (table.columns.find((c) => c.name === columnName)) {
          fields.push(columnName)
        } else {
          const column = table.columns.find((c) => {
            return (c.relation && c.relation.type === 'oneToMany' &&
              c.relation.table === columnName) ? true : false
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
