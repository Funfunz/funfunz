import request from 'supertest'
import { Funfunz } from '../middleware/index.js'
import test from 'node:test'
import assert from 'node:assert'
import config from './configs/config.js'
import entities from './configs/entities.js'
import { authenticatedServer } from './utils.js'

const funfunz = new Funfunz({
  config,
  entities
})

const application = funfunz.middleware
const authApplication = authenticatedServer(application)

test('graphql', async (t) => {
  await t.test('should throw an error if instanciating Funfunz without configs', () => {
    try {
      new Funfunz({
        config,
      } as any)
    } catch (error: unknown) {
      assert.equal((error as Error).message, 'Missing object "entities" on the cofiguration')
    }
    try {
      new Funfunz({
        entities,
      } as any)
    } catch (error: unknown) {
      assert.equal((error as Error).message, 'Missing object "config" on the cofiguration')
    }
    true
  })
  await t.test('graphql endpoint should return status 200', () => {
    return new Promise(
      (res, rej) => {
        request(application)
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
              return rej(err)
            }
            assert.equal(response.status, 200)
            return res(true)
          }
        )
      }
    )
  })
  await t.test('graphql endpoint with deep queries should return 200', () => {
    return new Promise(
      (res, rej) => {
        request(application)
        .post('/')
        .send({
          query: `{
            products {
              id
              price
              families {
                id
              }
            }
          }`,
        })
        .set('Accept', 'application/json').end(
          (err, response) => {
            if (err) {
              return rej(err)
            }
            assert.equal(response.status, 200)
            return res(true)
          }
        )
      }
    )
  })

  await t.test('graphql foat values should be supported', () => {
    return new Promise(
      (res, rej) => {
        request(application)
        .post('/')
        .send({
          query: `{
            products {
              price
            }
          }`,
        })
        .set('Accept', 'application/json').end(
          (err, response) => {
            if (err) {
              return rej(err)
            }
            assert.equal(response.status, 200)
            return res(true)
          }
        )
      }
    )
  })

  await t.test('graphql endpoint with recursive deep queries should return 200', () => {
    return new Promise(
      (res, rej) => {
        request(application)
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
              return rej(err)
            }
            assert.equal(response.status, 200)
            return res(true)
          }
        )
      }
    )
  })

  await t.test('graphql endpoint with unauthorized access', () => {
    return new Promise(
      (res, rej) => {
        request(application)
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
              return rej(err)
            }
            assert.equal(response.status, 200)
            assert.equal(response.body.errors[0].message, 'Not authorized')
            return res(true)
          }
        )
      }
    )
  })

  await t.test('graphql endpoint with many to many relations', () => {
    return new Promise(
      (res, rej) => {
        request(authApplication)
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
              return rej(err)
            }
            assert.equal(response.status, 200)
            assert.equal(!!response.body, true)
            const data = response.body.data
            assert.equal(!!data.users[0], true)
            assert.equal(!!data.users[0].id, true)
            assert.equal(!!data.users[0].roles[0], true)
            assert.equal(!!data.users[0].roles[0].id, true)
            return res(true)
          }
        )
      }
    )
  })

  await t.test('graphql endpoint with many to one relations', () => {
    return new Promise(
      (res, rej) => {
        request(application)
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
              return rej(err)
            }
            assert.equal(response.status, 200)
            assert.equal(!!response.body, true)
            const data = response.body.data
            assert.equal(!!data.products[0], true)
            assert.equal(!!data.products[0].id, true)
            assert.equal(!!data.products[0].families, true)
            assert.equal(!!data.products[0].families.id, true)
            return res(true)
          }
        )
      }
    )
  })
  await t.test('graphql endpoint with one to many relations', () => {
    return new Promise(
      (res, rej) => {
        request(application)
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
              return rej(err)
            }
            assert.equal(response.status, 200)
            assert.equal(!!response.body, true)
            const data = response.body.data
            assert.equal(!!data.families[0], true)
            assert.equal(!!data.families[0].id, true)
            assert.equal(!!data.families[0].products[0], true)
            assert.equal(!!data.families[0].products[0].id, true)
            return res(true)
          }
        )
      }
    )
  })
  await t.test('graphql endpoint with one to many relations with child filter', () => {
    return new Promise(
      (res, rej) => {
        request(application)
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
              return rej(err)
            }
            assert.equal(response.status, 200)
            assert.equal(!!response.body, true)
            const data = response.body.data
            assert.equal(!!data.families[0], true)
            assert.equal(!!data.families[0].id, true)
            assert.equal(!!data.families[0].products, true)
            return res(true)
          }
        )
      }
    )
  })
  
  await t.test('graphql pagination', () => {
    return new Promise(
      (res, rej) => {
        request(authApplication)
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
              return rej(err)
            }
            assert.equal(response.status, 200)
            assert.equal(!!response.body, true)
            const data = response.body.data
            assert.equal(!!data.users, true)
            assert.equal(!!data.users[0].id, true)
            return res(true)
          }
        )
      }
    )
  })
})
