import { isNull, getPKs } from '@root/api/utils'
import { ITableInfo } from '@root/generator/configurationTypes'

export default {
  normalize,
}

export function normalize(data: any, TABLE_CONFIG: ITableInfo) {
  TABLE_CONFIG.columns.forEach(
    (column) => {
      switch (column.model.type) {
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
  getPKs(TABLE_CONFIG).forEach(
    (pk) => {
      if (isNull(data[pk])) {
        delete data[pk]
      }
    }
  )
  return data
}
