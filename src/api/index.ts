import App from '@root/api/app'
import config, { setConfig } from '@root/api/utils/configLoader'
import Debug from 'debug'

export default function(configs: {config: any, settings: any, [key: string]: any}) {
  const debug = Debug('funfunzmc:server')

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

  /**
   * Create HTTP server if not loaded has a plugin.
   */

  if (!CONFIG.plugin) {
    import('@root/api/httpServer').then(
      (module) => {
        return module.default(app.server)
      }
    )
  }
  return app.server
}

export * from './types'
