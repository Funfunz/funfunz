import index from '../middleware'
import config from '../test/configs/MCconfig'
import settings from '../test/configs/MCsettings'
import httpServer from './httpServer'

const app = index({
  config,
  settings,
})

/**
 * Create HTTP server if not loaded has a plugin.
 */

httpServer(app.server)
