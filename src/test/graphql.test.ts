import request from 'supertest'
import { Funfunz } from '../middleware'

import config from './configs/config'
import settings from './configs/entities'

import { authenticatedServer } from './utils'

const funfunz = new Funfunz({
  config,
  settings
})

const application = funfunz.middleware
const authApplication = authenticatedServer(application)

describe('graphql', () => {
  it('should throw an error if instanciating Funfunz without configs', (done) => {
    try {
      new Funfunz({
        config,
      })
    } catch (error) {
      expect(error.message).toBe('Missing object "settings" on the cofiguration')
    }
    try {
      new Funfunz({
        settings,
      })
    } catch (error) {
      expect(error.message).toBe('Missing object "config" on the cofiguration')
    }
    done()
  })
  it('graphql endpoint should return status 200', (done) => {
    return request(application)
      .post('/')
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
      .post('/')
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

  it('graphql endpoint with recursive deep queries should return 200', (done) => {
    return request(application)
      .post('/')
      .send({
        query: `{
          images {
            id
            products {
              id
              families {
                id
                products {
                  id
                  images {
                    id
                  }
                }
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

  it('graphql endpoint with unauthorized access', (done) => {
    return request(application)
      .post('/')
      .send({
        query: `{
          users {
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
          expect(response.body.errors[0].message).toEqual('Not authorized')
          return done()
        }
      )
  })

  it('graphql endpoint with many to many relations', (done) => {
    return request(authApplication)
      .post('/')
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
          expect(data.users[0]).toBeTruthy()
          expect(data.users[0].id).toBeTruthy()
          expect(data.users[0].roles[0]).toBeTruthy()
          expect(data.users[0].roles[0].id).toBeTruthy()
          return done()
        }
      )
  })

  it('graphql endpoint with many to one relations', (done) => {
    return request(application)
      .post('/')
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
          expect(data.products[0]).toBeTruthy()
          expect(data.products[0].id).toBeTruthy()
          expect(data.products[0].families).toBeTruthy()
          expect(data.products[0].families.id).toBeTruthy()
          return done()
        }
      )
  })
  it('graphql endpoint with one to many relations', (done) => {
    return request(application)
      .post('/')
      .send({
        query: `{
          families {
            id
            products {
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
          expect(data.families[0]).toBeTruthy()
          expect(data.families[0].id).toBeTruthy()
          expect(data.families[0].products[0]).toBeTruthy()
          expect(data.families[0].products[0].id).toBeTruthy()
          return done()
        }
      )
  })
  it('graphql endpoint with one to many relations with child filter', (done) => {
    return request(application)
      .post('/')
      .send({
        query: `{
          families {
            id
            products (filter: { id: { _eq: 1}}) {
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
          expect(data.families[0]).toBeTruthy()
          expect(data.families[0].id).toBeTruthy()
          expect(data.families[0].products).toBeTruthy()
          return done()
        }
      )
  })
  
  it('graphql pagination', (done) => {
    return request(authApplication)
      .post('/')
      .send({
        query: `{
         users(take:1, skip: 1) {
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
          expect(response.body).toBeTruthy()
          const data = response.body.data
          expect(data.users).toBeTruthy()
          expect(data.users[0].id).toBeTruthy()
          return done()
        }
      )
  })
})
