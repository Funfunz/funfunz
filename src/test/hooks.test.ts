import test from 'node:test'
import assert from 'node:assert'
import { Funfunz } from '../middleware/index.js'
import config from './configs/config.js'
import entities from './configs/entities.js'
import { server } from './utils.js'
import axios from 'axios'

const applicationMiddleware = new Funfunz({
  config,
  entities
}).middleware

let funfunzInstance
let simpleApplication
let simpleApplicationUrl

test('hooks', async (t) => {
  t.before(() => {
    funfunzInstance = new Funfunz({
      config,
      entities
    })
 
    const simplePort = 4033
    simpleApplication = server(funfunzInstance.middleware, simplePort)
    simpleApplicationUrl = 'http://localhost:' + simplePort + '/api'
    return new Promise(
      (res) => {
        setTimeout(() => {res(true)}, 2000)
      }
    )
  })
  
  t.after(async () => {
    await new Promise(
      (res) => {
        funfunzInstance.stopDataConnectors()
        simpleApplication.closeAllConnections()
        simpleApplication.close(
          (errorAuth) => {
            if (errorAuth) {
              console.log({errorAuth})
            }
            res(true)
          }
        )
      }
    )
  })
  
  await t.test('hook to throw error', async () => {
    const response = await axios.post(simpleApplicationUrl, {
      query: `{
        usersCount
      }`,
    })
    assert.equal(response.status, 200)
    assert.equal(!!response.data, true)
    const errors = response.data.errors
    assert.equal(errors[0].message, 'Not authorized')
  })
  
  await t.test('hook to change query input', async () => {
    const response = await axios.post(simpleApplicationUrl, {
      query: `{
        productsCount
      }`,
    })
   assert.equal(response.status, 200)
    assert.equal(!!response.data, true)
    const data = response.data.data
    assert.equal(!!data, true)
    assert.equal(data.productsCount, 1)
  })

  await t.test('hook to change query output', async () => {
    const response = await axios.post(simpleApplicationUrl, {
      query: `{
        familiesCount
      }`,
    })
    assert.equal(response.status, 200)
    assert.equal(!!response.data, true)
    const data = response.data.data
    assert.equal(!!data, true)
    assert.equal(data.familiesCount, 69)
  })
})
