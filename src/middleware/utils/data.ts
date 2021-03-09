import { isNull, getPKs } from './index'
import { IEntityInfo } from '../../generator/configurationTypes'

export default {
  normalize,
}

export function normalize(data: Record<string, unknown>, TABLE_CONFIG: IEntityInfo): Record<string, unknown> {
  getPKs(TABLE_CONFIG).forEach(
    (pk) => {
      if (isNull(data[pk])) {
        delete data[pk]
      }
    }
  )
  return data
}
