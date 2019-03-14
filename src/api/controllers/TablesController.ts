import { IMCResponse } from '@root/api/types';
import { addToResponse, buildError, nextAndReturn } from '@root/api/utils'
import config from '@root/api/utils/configLoader'
import Debug from 'debug'
import { NextFunction, Request } from 'express';

const debug = Debug('funfunzmc:controller-tables')

class TablesController {
  public settings: any[]
  constructor() {
    debug('Created')
    this.settings = config().settings
  }

  public getTables(req: Request, res: IMCResponse, next: NextFunction) {
    if (!this.settings || this.settings.length === 0) {
      throw buildError('Tables not found', 404)
    } else {
      const tables = this.settings.map(
        (table) => ({
          name: table.name,
          verbose: table.verbose,
        })
      )
      addToResponse(res, tables, 'tables')
      return nextAndReturn(next)(tables)
    }
  }
}

export default TablesController
