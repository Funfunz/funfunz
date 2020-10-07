import App from './app'
import config, { setConfig } from './utils/configLoader'
import Debug from 'debug'

export default function(configs: {config: any, settings: any, [key: string]: any}) {
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

  const app = new App()
  return app
}

export * from './types'
