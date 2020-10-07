import index from '../src/middleware'
import config from '../src/test/configs/MCconfig'
import settings from '../src/test/configs/MCsettings'
import httpServer from './httpServer'

const app = index({
  config,
  settings,
})

/**
 * Create HTTP server if not loaded has a plugin.
 */

httpServer(app.server)
