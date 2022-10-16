import { ExpressMiddleware } from './middleware.js'
import configLoaded, { setConfig } from './utils/configLoader.js'
import { Express } from 'express'
import Debug from 'debug'
import { IFunfunzConfig } from './types.js'
import { execute, ExecutionResult, GraphQLSchema, parse } from 'graphql'
import { isPromise } from './utils/index.js'
import { SchemaManager } from './graphql/manager.js'

export * from './types.js'
export class Funfunz {
  public middleware: Express
  public config: () => IFunfunzConfig
  public schemaManager: SchemaManager<unknown>

  constructor(configs: IFunfunzConfig) {
    const debug = Debug('funfunz:server')

    if (!configs.entities) {
      throw new Error('Missing object "entities" on the cofiguration')
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
    this.schemaManager = new SchemaManager<unknown>({
      queries: configs.queries,
      mutations: configs.mutations,
      context: configs.context
    })

    this.middleware = (new ExpressMiddleware(this)).express
  }

  public static executeGraphQL(schema: GraphQLSchema, document: string, context?: unknown): Promise<ExecutionResult> {
    const result = execute({
      schema,
      document: parse(document),
      contextValue: context
    })
    if (isPromise<ExecutionResult>(result)) {
      return result
    }
    return Promise.resolve<ExecutionResult>(result)
  }
}
