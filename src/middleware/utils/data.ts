import { isNull, getPKs } from './index'
import { ITableInfo } from '../../generator/configurationTypes'

export default {
  normalize,
}

export function normalize(data: Record<string, unknown>, TABLE_CONFIG: ITableInfo, includeRequired = false): Record<string, unknown> {
  TABLE_CONFIG.columns.forEach(
    (column) => {
      switch (column.model.type) {
      case 'datetime':
        if (data[column.name] || (includeRequired && !column.model.allowNull)) {
          data[column.name] = new Date((data[column.name] as 'string') || null)
        }
        break
      case 'tinyint(1)':
        data[column.name] = (
          data[column.name] === '1' || data[column.name] === 1
        ) ? 1 : 0
      }
    }
  )
  getPKs(TABLE_CONFIG).forEach(
    (pk) => {
      if (isNull(data[pk])) {
        delete data[pk]
      }
    }
  )
  return data
}
