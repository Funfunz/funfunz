import Debug from 'debug'
import { MCResponse } from '@root/api/types';
import { NextFunction, Request } from 'express';
import { buildError, addToResponse, nextAndReturn } from '@root/api/utils'
import config from '@root/api/utils/configLoader'

const debug = Debug('funfunzmc:controller-tables')

class TablesController {
  settings: Array<any>
  constructor () {
    debug('Created')
    this.settings = config().settings
  }

  getTables (req: Request, res: MCResponse, next: NextFunction) {
    if (!this.settings || this.settings.length === 0) {
      throw buildError('Tables not found', 404)
    } else {
      const tables = this.settings.map(
        table => table.name
      )
      addToResponse(res, tables, 'tables')
      return nextAndReturn(next)(tables)
    }
  }
}

export default TablesController
