import { isNull, getPKs } from './index'
import { IEntityInfo } from '../../generator/configurationTypes'

export default {
  normalize,
}

export function normalize(data: Record<string, unknown>, TABLE_CONFIG: IEntityInfo, includeRequired = false): Record<string, unknown> {
  TABLE_CONFIG.properties.forEach(
    (property) => {
      switch (property.model.type) {
      case 'datetime':
        if (data[property.name] || (includeRequired && !property.model.allowNull)) {
          data[property.name] = new Date((data[property.name] as 'string') || null)
        }
        break
      case 'tinyint(1)':
        data[property.name] = (
          data[property.name] === '1' || data[property.name] === 1
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
