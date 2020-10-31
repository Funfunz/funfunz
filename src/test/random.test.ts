import { sendJSON } from '../middleware/middleware/response'
import { HttpException } from '../middleware/types'
import {
  addToResponse,
  catchMiddleware,
  errorHandler,
} from '../middleware/utils'
import config, { setConfig } from '../middleware/utils/configLoader'
import MCconfig from './configs/MCconfig'

describe('Utils', () => {

  it('addToResponse should throw 500 if response object not present', () => {
    expect(() => {
      addToResponse(undefined, 'test')({})
    }).toThrow(new HttpException(500, 'Response object not valid'))
  })

  it('catchMiddleware should rethrow error if next function not present', () => {
    const err = new HttpException(500, 'Response object not valid')
    expect(() => {
      catchMiddleware(undefined, err)
    }).toThrow(err)
  })

  it('normalizePort should return the original value if not a number', () => {
    MCconfig.server.port = 'hello'
    setConfig(MCconfig, 'config')
    expect(config().config.server.port).toBe('hello')
  })

  it('normalizePort should return false port if number < 0', () => {
    MCconfig.server.port = -1
    setConfig(MCconfig, 'config')
    expect(config().config.server.port).toBe(false)
  })

  it('send json should answer an empty object if data not found', () => {
    sendJSON('hello')({}, {json: (answer) => {
      expect(answer).toMatchObject({})
    }})
  })

  it('errorHandler should send an object containing a message and have the sames status of the error', () => {
    const req = {
      params: {},
      body: {},
    }

    const res = {
      data: null,
      code: null,
      status(status) {
        this.code = status
      },
      json(payload) {
        this.data = payload
      },
    }
    errorHandler(new HttpException(404, 'not found'), req, res, () => {return})
    expect(res.code).toBeDefined()
    expect(res.code).toBe(404)

    expect(res.data).toBeDefined()
    expect(res.data).toMatchObject({message: 'not found'})
  })
})
