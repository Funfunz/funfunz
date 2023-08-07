import { isNull, getPKs } from './index.js'
import { IEntityInfo } from '../../generator/configurationTypes.js'

export default {
  normalize,
}

export function normalize(data: Record<string, unknown>, entityConfig: IEntityInfo): Record<string, unknown> {
  getPKs(entityConfig).forEach(
    (pk) => {
      if (isNull(data[pk])) {
        delete data[pk]
      }
    }
  )
  return data
}
