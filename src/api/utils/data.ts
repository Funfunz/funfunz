import { isNull } from '@root/api/utils'
import { ITableInfo } from '@root/generator/configurationTypes'

export default {
  normalize,
}

export function normalize(data: any, TABLE_CONFIG: ITableInfo) {
  TABLE_CONFIG.columns.forEach(
    (column) => {
      switch (column.type) {
        case 'datetime':
          data[column.name] = data[column.name]
            ? new Date(data[column.name])
            : new Date()
          break;
        case 'tinyint(1)':
          data[column.name] = (
            data[column.name] === '1' || data[column.name] === 1
          ) ? 1 : 0
      }
    }
  )
  if (Array.isArray(TABLE_CONFIG.pk)) {
    TABLE_CONFIG.pk.forEach(
      (pk) => {
        if (isNull(data[pk])) {
          delete data[pk]
        }
      }
    )
  } else {
    if (isNull(data[TABLE_CONFIG.pk])) {
      delete data[TABLE_CONFIG.pk]
    }
  }
  return data
}
