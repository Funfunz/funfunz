import config from '../utils/configLoader'
import Debug from 'debug'
import Knex from 'knex'
import { IFilter } from '../utils/filter'
import type { SQLDataConnector } from './SQLDataConnector'

const debug = Debug('funfunz:dataConnector')

export interface IQueryArgs {
  entityName: string,
  count?: boolean,
  fields?: string[],
  filter: IFilter,
  skip?: number,
  take?: number,
  relation?: string,
}
const connectors: Record<string, SQLDataConnector> = {} 

export const initDatabases = (): void => {
  const configuration = config().config.connectors
  Object.entries(configuration).forEach(
    ([key, value]) => {
      if (!connectors[key]) {
        switch (configuration[key].type) {
        case 'mysql':
          import('./SQLDataConnector').then(
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

export const database = (connectorName: string): Knex=> {
  return connectors[connectorName].db as Knex
}


/*
type IQuery = any; type IResults = any; type IResult = any;
type InitFunction = (config: any) => Promise<void>
type QueryFunction = (args: IQuery) => Promise<IResults>
type UpdateFunction = (args: IQuery) => Promise<IResult>
type DeleteFunction = (args: IQuery) => Promise<void>*/