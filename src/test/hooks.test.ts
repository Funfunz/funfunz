import request from 'supertest'
import { Funfunz } from '../middleware'

import config from './configs/config'
import settings from './configs/entities'

const application = new Funfunz({
  config,
  settings
}).middleware

describe('hooks', () => {
  it('hook to throw error', (done) => {
    return request(application)
      .post('/api')
      .send({
        query: `{
          usersCount
        }`,
      })
      .set('Accept', 'application/json').end(
        (err, response) => {
          if (err) {
            return done(err)
          }
          expect(response.status).toBe(200)
          expect(response.body).toBeTruthy()
          const errors = response.body.errors
          expect(errors[0].message).toBe('Not authorized')
          return done()
        }
      )
  })
  it('hook to change query input', (done) => {
    return request(application)
      .post('/api')
      .send({
        query: `{
          productsCount
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
          expect(data).toBeTruthy()
          expect(data.productsCount).toBe(1)
          return done()
        }
      )
  })
  it('hook to change query output', (done) => {
    return request(application)
      .post('/api')
      .send({
        query: `{
          familiesCount
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
          expect(data).toBeTruthy()
          expect(data.familiesCount).toBe(69)
          return done()
        }
      )
  })
})
