import App from './app'
import configLoaded, { setConfig } from './utils/configLoader'
import { Express } from 'express'
import Debug from 'debug'
import { IFunfunzConfig } from './types'
import { execute, ExecutionResult, GraphQLSchema, parse } from 'graphql'
import { isPromise } from './utils'
import buildGraphQLSchema from './graphql/schema'

class Funfunz {
  public middleware: Express
  public config: () => IFunfunzConfig
  public schema: GraphQLSchema

  constructor(configs: IFunfunzConfig) {
    const debug = Debug('funfunz:server')

    if (!configs.settings) {
      throw new Error('Missing object "settings" on the cofiguration')
    }

    if (!configs.config) {
      throw new Error('Missing object "config" on the cofiguration')
    }

    Object.keys(configs).forEach(
      (configKey) => {
        if (configKey !== 'queries' && configKey !== 'mutations') {
          setConfig(configs[configKey], configKey)
        }
      }
    )

    this.config = configLoaded
    
    debug('---------------------------------------------')
    debug('INIT PARAMETERS:\n', this.config().config)
    debug('NODE_ENV', process.env.NODE_ENV)
    debug('---------------------------------------------')
    this.schema = buildGraphQLSchema(
      this,
      {
        queries: configs.queries,
        mutations: configs.mutations
      }
    )

    this.middleware = (new App(this)).server
  }

  public executeGraphQL(document: string): Promise<ExecutionResult> {
    const result = execute({
      schema: this.schema,
      document: parse(document),
      contextValue: {
        superUser: true
      }
    })
    if (isPromise<ExecutionResult>(result)) {
      return result
    }
    return Promise.resolve<ExecutionResult>(result)
  }
}

export { Funfunz }
export * from './types'
