import config from '../utils/configLoader.js'
import type { IQueryArgs, IUpdateArgs, ICreateArgs, IRemoveArgs, DataConnector } from '../../types/connector.js'
import { Funfunz } from '../index.js'

const connectors: Record<string, DataConnector> = {} 

export const initDataConnectors = (funfunz: Funfunz): void => {
  const configuration = config().config.connectors
  Object.entries(configuration).forEach(
    ([key, value]) => {
      if (!connectors[key]) {
        connectors[key] = new value.connector(value, funfunz)
      }
    }
  )
}

export const stopDataConnectors = (): void => {
  Object.entries(connectors).forEach(
    ([key]) => {
      connectors[key].stop()
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
