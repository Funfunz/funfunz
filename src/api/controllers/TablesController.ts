import { IMCRequest, IMCResponse } from '@root/api/types';
import { addToResponse, hasAuthorization, nextAndReturn } from '@root/api/utils'
import config from '@root/api/utils/configLoader'
import { ITableInfo } from '@root/generator/configurationTypes'
import Debug from 'debug'
import { NextFunction } from 'express'

const debug = Debug('funfunzmc:controller-tables')

class TablesController {
  public settings: ITableInfo[]
  constructor() {
    debug('Created')
    this.settings = config().settings
  }

  // returns a list of all database tables
  public getTables(req: IMCRequest, res: IMCResponse, next: NextFunction) {
    const tables = this.settings.filter((t) => t.visible).map(
      (table: ITableInfo) => {
        let isAuthorized: boolean = true
        if (!table.visible) {
          return undefined
        }
        if (table.roles && table.roles.read && table.roles.read.length) {
          isAuthorized = hasAuthorization(table.roles.read, req.user)
        }
        if (isAuthorized) {
          const result: any = {}
          Object.keys(table).forEach((key) => {
            if (!['columns', 'relations'].includes(key)) {
              result[key] = (table as any)[key]
            }
          })
          return result
        }
        return undefined
      }
    ).filter(
      (table) => table
    )
    addToResponse(res, 'tables')(tables)
    return nextAndReturn(next)(tables)
  }
}

export default TablesController
