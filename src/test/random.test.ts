import { HttpException } from '../middleware/utils/exception'
import config, { setConfig } from '../middleware/utils/configLoader'
import MCconfig from './configs/MCconfig'
import { IConfig } from '../generator/configurationTypes'

describe('Utils', () => {

  it('normalizePort should return the original value if not a number', () => {
    (MCconfig as IConfig).server.port = 'hello'
    setConfig(MCconfig, 'config')
    expect(config().config.server.port).toBe('hello')
  })

  it('normalizePort should return false port if number < 0', () => {
    MCconfig.server.port = -1
    setConfig(MCconfig, 'config')
    expect(config().config.server.port).toBe(false)
  })
})
