import request from 'supertest'
import app from '../src/api'
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

  it('get distinct table data', () => {
    return request(application)
    .get('/table/products/distinct?' +
      'columns[]=color' +
      '&search=e&filter:{"color":"e"}'
    ).then(
      (response) => {
        return expect(response.body && response.body.color && response.body.color.length === 3).toBe(true)
      }
    )
  })

  it('get distinct table data multiple order and columns using memory', () => {
    return request(application)
    .get('/table/products/distinct?' +
      'columns[]=color' +
      '&search=e&filter:{"color":"e"}'
    ).then(
      () => {
        return request(application)
        .get('/table/products/distinct?' +
          'columns[]=color&columns[]=name' +
          '&search=e&filter:{"color":"e"}'
        )
      }
    ).then(
      (response) => {
        return expect(response.body && response.body.color && response.body.color.length === 3).toBe(true)
      }
    )
  })

  it('get table data with array order', () => {
    return request(application)
    .get('/table/products?friendlyData=true&order=["name", "id"]&limit=10&search=asd').then(
      (response) => {
        return expect(response.status).toBe(200)
      }
    )
  })

  it('search table data, on a table without searchFields', () => {
    return request(application)
    .get('/table/roles?search=asd').then(
      (response) => {
        return expect(response.status).toBe(200)
      }
    )
  })

  it('get table data with filters id and name', () => {
    return request(application)
    .get('/table/products?friendlyData=true&filter={"id":1,"name":"name"}').then(
      (response) => {
        return expect(response.status).toBe(200)
      }
    )
  })

  it('get table data with filters name and id', () => {
    return request(application)
    .get('/table/products?friendlyData=true&filter={"name":"name","id":1}').then(
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

  it('get quantity of items on a table', () => {
    return request(application).get('/table/products/count?search=asd&filter={"name":"name"}').then(
      (response) => {
        return expect(response.status).toBe(200)
      }
    )
  })

  it('get a row by id without, multiple pk', () => {
    return request(application).post('/tableData/products').send({
      pk: {
        id: 1,
      },
    }).then(
      (response) => {
        return expect(response.status).toBe(200)
      }
    )
  })

  it('get a row by id with relations, multiple pk', () => {
    return request(application).post('/tableData/products?includeRelations=true').send({
      pk: {
        id: 1,
      },
    }).then(
      (response) => {
        return expect(response.status).toBe(200)
      }
    )
  })

  it('get a row by id with many to many relations, multiple pk', () => {
    return request(application).post('/tableData/roles?includeRelations=true').send({
      pk: {
        id: 1,
      },
    }).then(
      (response) => {
        return expect(response.status).toBe(200)
      }
    )
  })

  it('update a row by id, multiple pk', () => {
    return request(application).put('/tableData/products').send({
      pk: {
        id: 30,
      },
      data: {
        name: 'nameUpdated',
      },
    }).then(
      (response) => {
        return expect(response.status).toBe(200)
      }
    )
  })

  it('no data while updating a row', () => {
    return request(application).put('/products/1').then(
      (response) => {
        return expect(response.status).toBe(500)
      }
    )
  })

  it('delete a row by id, multiple pk', () => {
    return request(application).post('/tableData/products/delete').send({
      pk: {
        id: 30,
      },
    }).then(
      (response) => {
        return expect(response.status).toBe(200)
      }
    )
  })

  it('insert a row', () => {
    return request(application)
      .post('/products')
      .send({
        data: {
          id: 30,
          name: 'nameInserted',
          color: 'yellow',
          active: 0,
          FamilyId: 2,
          type: 2,
          createdAt: new Date().getTime(),
        },
      }).then(
      (response) => {
        return expect(response.status).toBe(200)
      }
    )
  })

  it('insert a row, testing tinyint with true value and no id', () => {
    return request(application)
      .post('/products')
      .send({
        data: {
          id: '',
          name: 'nameInserted',
          color: 'yellow',
          active: 1,
          FamilyId: 2,
          type: 2,
          createdAt: new Date().getTime(),
        },
      }).then(
      (response) => {
        return expect(response.status).toBe(200)
      }
    )
  })

  it('insert a row without authorization', () => {
    return request(application)
      .post('/users')
      .send({
        data: {
          name: 'nameInserted',
        },
      }).then(
      (response) => {
        return expect(response.status).toBe(401)
      }
    )
  })
})

describe('graphql', () => {
  it('graphql endpoint should return status 200', (done) => {
    return request(application)
      .post('/graphql')
      .send({
        query: `{
          families {
            id
          }
        }`,
      })
      .set('Accept', 'application/json').end(
      (err, response) => {
        if (err) {
          return done(err)
        }
        expect(response.status).toBe(200)
        return done()
      }
    )
  })
  it('graphql endpoint with deep queries should return 200', (done) => {
    return request(application)
      .post('/graphql')
      .send({
        query: `{
          products {
            id
            FamilyId {
              id
            }
          }
        }`,
      })
      .set('Accept', 'application/json').end(
      (err, response) => {
        if (err) {
          return done(err)
        }
        expect(response.status).toBe(200)
        return done()
      }
    )
  })

  it('graphql endpoint with deep queries should return 200', (done) => {
    return request(application)
      .post('/graphql')
      .send({
        query: `{
          images {
            id
            ProductId {
              id
              FamilyId {
                name
              }
            }
          }
        }`,
      })
      .set('Accept', 'application/json').end(
      (err, response) => {
        if (err) {
          return done(err)
        }
        expect(response.status).toBe(200)
        return done()
      }
    )
  })
})
