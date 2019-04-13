import request from 'supertest'
import app from '../lib/api'
import config from './configs/MCconfig'
import settings from './configs/MCsettings'

const application = app({
  config,
  settings,
  plugin: true,
})

describe('Start server', () => {
  it('should throw an error if no config object set', () => {
    expect(() => {
      app({
        settings: {},
      })
    }).toThrowError('"config"')
  })

  it('should throw an error if no settings object set', () => {
    expect(() => {
      app({
        config: {},
      })
    }).toThrowError('"settings"')
  })

  it('should throw an error if one of the parameters is undefined', () => {
    expect(() => {
      app({
        other: undefined,
        config,
        settings,
      })
    }).toThrowError('Configuration is missing')
  })

  it('should throw an error if invalid settings or config', () => {
    expect(() => {
      app({
        config,
        settings: {},
      })
    }).toThrowError('instance')
    expect(() => {
      app({
        config: {},
        settings,
      })
    }).toThrowError('instance')
  })

  it('a valid request should return status 200', () => {
    return request(application).get('/').then(
      (response) => {
        expect(response.status).toBe(200)
      }
    )
  })

  it('an invalid request should return 200 with the admin frontend', () => {
    return request(application).get('/stuff').then(
      (response) => {
        expect(response.status).toBe(200)
      }
    )
  })

  it('unauthenticated requests should return 401 unauthorized', () => {
    return request(application).get('/table/users/config').then(
      (response) => {
        expect(response.status).toBe(401)
      }
    )
  })
});

describe('routes', () => {
  afterAll(() => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 500)
    }) // avoid jest open handle error
  });

  it('get tables', () => {
    return request(application).get('/tables').then(
      (response) => {
        return expect(response.status).toBe(200)
      }
    )
  })

  it('get table data', () => {
    return request(application)
    .get('/table/products?friendlyData=true&order={"column":"id","order":"asc"}&limit=10&search=asd').then(
      (response) => {
        return expect(response.status).toBe(200)
      }
    )
  })

  it('get table data unauthorized', () => {
    return request(application).get('/table/users?friendlyData=true').then(
      (response) => {
        return expect(response.status).toBe(401)
      }
    )
  })

  it('get table config', () => {
    return request(application).get('/table/products/config').then(
      (response) => {
        return expect(response.status).toBe(200)
      }
    )
  })
})
