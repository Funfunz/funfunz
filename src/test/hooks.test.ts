import request from 'supertest'
import test from 'node:test'
import assert from 'node:assert'
import { Funfunz } from '../middleware/index.js'

import config from './configs/config.js'
import entities from './configs/entities.js'

const application = new Funfunz({
  config,
  entities
}).middleware

test('hooks', async (t) => {
  await t.test('hook to throw error', async () => {
    return new Promise(
      (res, rej) => {
        request(application)
        .post('/api')
        .send({
          query: `{
            usersCount
          }`,
        })
        .set('Accept', 'application/json').end(
          (err, response) => {
            if (err) {
              return rej(err)
            }
            assert.equal(response.status, 200)
            assert.equal(!!response.body, true)
            const errors = response.body.errors
            assert.equal(errors[0].message, 'Not authorized')
            return res(true)
          }
        )
      }
    )
  })
  await t.test('hook to change query input', async () => {
    return new Promise(
      (res, rej) => {
        request(application)
        .post('/api')
        .send({
          query: `{
            productsCount
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
            assert.equal(!!data, true)
            console.log({data})
            assert.equal(data.productsCount, 1)
            return res(true)
          }
        )
      }
    )
  })
  await t.test('hook to change query output', async () => {
    return new Promise(
      (res, rej) => {
        request(application)
        .post('/api')
        .send({
          query: `{
            familiesCount
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
            assert.equal(!!data, true)
            console.log({data})
            assert.equal(data.familiesCount, 69)
            return res(true)
          }
        )
      }
    )
  })
})
