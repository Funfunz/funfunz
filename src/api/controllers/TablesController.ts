import { HttpException, IMCRequest, IMCResponse } from '@root/api/types';
import { addToResponse, catchMiddleware, hasAuthorization, nextAndReturn } from '@root/api/utils'
import config from '@root/api/utils/configLoader'
import { ITableInfo } from '@root/configGenerator'
import Debug from 'debug'
import { NextFunction } from 'express'

const debug = Debug('funfunzmc:controller-tables')

class TablesController {
  public settings: ITableInfo[]
  constructor() {
    debug('Created')
    this.settings = config().settings
  }

  public getTables(req: IMCRequest, res: IMCResponse, next: NextFunction) {
    if (!this.settings || this.settings.length === 0) {
      return catchMiddleware(next)(new HttpException(404, 'Tables not found'))
    } else {
      let userRoles: string[] = []
      if (req.user && req.user.roles) {
        userRoles = req.user.roles
      }
      const tables = this.settings.map(
        (table: ITableInfo) => {
          let isAuthorized: boolean = true
          if (!table.visible) {
            return undefined
          }
          if (table.roles && table.roles.length) {
            isAuthorized = hasAuthorization(table.roles, userRoles)
          }
          if (isAuthorized) {
            return {
              name: table.name,
              verbose: table.verbose,
            }
          }
          return undefined
        }
      ).filter(
        (table) => table
      )
      addToResponse(res, tables, 'tables')
      return nextAndReturn(next)(tables)
    }
  }
}

export default TablesController
