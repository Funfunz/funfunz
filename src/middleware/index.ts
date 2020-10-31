import App from './app'
import config, { setConfig } from './utils/configLoader'
import { Express } from 'express'
import Debug from 'debug'
import { IConfig, ISettings } from '../generator/configurationTypes'

class Funfunz {
  public middleware: Express

  constructor(configs: {config: IConfig, settings: ISettings, [key: string]: unknown}) {
    const debug = Debug('funfunz:server')

    if (!configs.settings) {
      throw new Error('Missing object "settings" on the cofiguration')
    }

    if (!configs.config) {
      throw new Error('Missing object "config" on the cofiguration')
    }

    setConfig(true, 'defaultInterface')

    Object.keys(configs).forEach(
      (configKey) => {
        setConfig(configs[configKey], configKey)
      }
    )

    const CONFIG = config()

    debug('---------------------------------------------')
    debug('INIT PARAMETERS:\n', CONFIG.config.server)
    debug('NODE_ENV', process.env.NODE_ENV)
    debug('---------------------------------------------')

    this.middleware = (new App()).server
  }
}

export { Funfunz }
export * from './types'
