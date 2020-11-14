import App from './app'
import config, { setConfig } from './utils/configLoader'
import { Express } from 'express'
import Debug from 'debug'
import { IFunfunzConfig } from './types'

class Funfunz {
  public middleware: Express

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
        setConfig(configs[configKey], configKey)
      }
    )

    const CONFIG = config()
    
    debug('---------------------------------------------')
    debug('INIT PARAMETERS:\n', CONFIG.config)
    debug('NODE_ENV', process.env.NODE_ENV)
    debug('---------------------------------------------')

    this.middleware = (new App()).server
  }
}

export { Funfunz }
export * from './types'
