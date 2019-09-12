import request from 'supertest'
import app from '../src/api'
import config from './configs/MCconfig'
import settings from './configs/MCsettings'

const application = app({
  config,
  settings,
  plugin: true,
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
            families {
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
            products {
              id
              families {
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

  it('graphql endpoint with many to many relations', (done) => {
    return request(application)
      .post('/graphql')
      .send({
        query: `{
          users {
            id
            roles {
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
        expect(response.body).toBeTruthy()
        const data = response.body.data
        expect(data.users[0].roles[0]).toBeTruthy()
        return done()
      }
    )
  })
  it('graphql endpoint with many to one relations', (done) => {
    return request(application)
      .post('/graphql')
      .send({
        query: `{
          products {
            id
            families {
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
        expect(response.body).toBeTruthy()
        const data = response.body.data
        expect(data.images[0].products[0]).toBeTruthy()
        return done()
      }
    )
  })
  it('graphql endpoint with one to many relations', (done) => {
    return request(application)
      .post('/graphql')
      .send({
        query: `{
          products {
            id
            images {
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
        expect(response.body).toBeTruthy()
        const data = response.body.data
        expect(data.products[0].images[0]).toBeTruthy()
        return done()
      }
    )
  })
})
