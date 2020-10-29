import { Funfunz } from '../middleware'
import config from '../test/configs/MCconfig'
import settings from '../test/configs/MCsettings'
import httpServer from './httpServer'

const funfunz = new Funfunz({
  config,
  settings,
})

/**
 * Create HTTP server if not loaded has a plugin.
 */

httpServer(funfunz.middleware)
