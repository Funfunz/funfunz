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