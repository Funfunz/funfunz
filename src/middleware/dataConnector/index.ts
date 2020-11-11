import config from '../utils/configLoader'
import Debug from 'debug'
import { IFilter } from '../utils/filter'

const debug = Debug('funfunz:dataConnector')

export interface IQueryArgs {
  entityName: string,
  count?: boolean,
  fields?: string[],
  filter?: IFilter,
  skip?: number,
  take?: number,
  relation?: string,
}

export interface IUpdateArgs {
  entityName: string,
  count?: boolean,
  fields?: string[],
  filter: IFilter,
  skip?: number,
  take?: number,
  data: Record<string, unknown>
}

export interface ICreateArgs {
  entityName: string,
  count?: boolean,
  fields?: string[],
  skip?: number,
  take?: number,
  data: Record<string, unknown>
}

export interface IRemoveArgs {
  entityName: string,
  filter: IFilter
}

type globaEntry = Record<string, unknown>

export interface DataConnector {
  query (args: IQueryArgs): Promise<globaEntry[] | globaEntry | number>
  update: (args: IUpdateArgs) => Promise<globaEntry[] | globaEntry | number>
  create: (args: ICreateArgs) => Promise<globaEntry[] | globaEntry>
  remove: (args: IRemoveArgs) => Promise<number>
  db: unknown
}

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
export const database = (connectorName: string): unknown=> {
  return connectors[connectorName].db
}
