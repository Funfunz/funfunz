import config from '../utils/configLoader'
import Debug from 'debug'
import { IQueryArgs, IUpdateArgs, ICreateArgs, IRemoveArgs, DataConnector } from '../../types/connector'

const debug = Debug('funfunz:dataConnector')

const connectors: Record<string, DataConnector> = {} 

export const initDatabases = (): void => {
  const configuration = config().config.connectors
  Object.entries(configuration).forEach(
    ([key, value]) => {
      if (!connectors[key]) {
        switch (configuration[key].type) {
        case 'sql':
          import('../../dataConnectors/SQLDataConnector').then(
            (module) => {
              connectors[key] = new module.SQLDataConnector(value)
            }
          )
          break
        default:
          throw new Error(`connector type ${configuration[key].type} not supported`)
        }
        
      }
      debug('Start')
      Object.keys(value).forEach(
        (key) => {
          debug(key, (value)[key])
        }
      )
      debug('End')
    }
  )
}

export const query = (connectorName: string, args: IQueryArgs): Promise<unknown[] | unknown> => {
  return connectors[connectorName].query(args)
}

export const update = (connectorName: string, args: IUpdateArgs): Promise<unknown[] | unknown> => {
  return connectors[connectorName].update(args)
}

export const create = (connectorName: string, args: ICreateArgs): Promise<unknown[] | unknown> => {
  return connectors[connectorName].create(args)
}

export const remove = (connectorName: string, args: IRemoveArgs): Promise<number> => {
  return connectors[connectorName].remove(args)
}

export const connector = (connectorName: string): DataConnector => {
  return connectors[connectorName]
}

// DEPRECATED!!!
export const connection = (connectorName: string): unknown=> {
  return connectors[connectorName].connection
}
