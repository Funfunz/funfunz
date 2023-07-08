import { Funfunz } from '../middleware/index.js'
import test from 'node:test'
import assert from 'node:assert'
import config from './configs/config.js'
import entities from './configs/entities.js'
import { authenticatedServer, server } from './utils.js'
import axios from 'axios'

let funfunzInstance
let authApplication
let authApplicationUrl
let simpleApplication
let simpleApplicationUrl


test('graphql', async (t) => {
  t.before(() => {
    funfunzInstance = new Funfunz({
      config,
      entities
    })
 
    const authPort = 4022
    authApplication = authenticatedServer(funfunzInstance.middleware, authPort)
    authApplicationUrl = 'http://localhost:' + authPort + '/api'
    const simplePort = 4023
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
        authApplication.closeAllConnections()
        authApplication.close(
          (errorAuth) => {
            if (errorAuth) {
              console.log({errorAuth})
            }
            simpleApplication.closeAllConnections()
            simpleApplication.close(
              (errorSimple) => {
                if (errorSimple) {
                  console.log({errorSimple})
                }
                res(true)
              }          
            )
          }
        )
      }
    )
  })
  
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
  await t.test('graphql endpoint should return status 200', async () => {
    const response = await axios.post(authApplicationUrl, {
      query: `{
        families {
          id
        }
      }`,
    })
   
    assert.equal(response.status, 200)
  })
  await t.test('graphql endpoint with deep queries should return 200', async () => {
    const response = await axios.post(authApplicationUrl, {
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
    assert.equal(response.status, 200)
  })

  await t.test('graphql foat values should be supported', async () => {
    const response = await axios.post(authApplicationUrl, {
      query: `{
        products {
          price
        }
      }`,
    })
    assert.equal(response.status, 200)
  })

  await t.test('graphql endpoint with recursive deep queries should return 200', async () => {
    const response = await axios.post(authApplicationUrl, {
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
    assert.equal(response.status, 200)
  })

  await t.test('graphql endpoint with unauthorized access', async () => {
    const response = await axios.post(simpleApplicationUrl, {
      query: `{
        users {
          id
        }
      }`,
    })
    assert.equal(response.status, 200)
    assert.equal(response.data.errors[0].message, 'Not authorized')
  })

  await t.test('graphql endpoint with many to many relations', async () => {
    const response = await axios.post(authApplicationUrl, {
      query: `{
        users {
          id
          roles {
            id
          }
        }
      }`,
    })
    assert.equal(response.status, 200)
    assert.equal(!!response.data, true)
    const data = response.data.data
    assert.equal(!!data.users[0], true)
    assert.equal(!!data.users[0].id, true)
    assert.equal(!!data.users[0].roles[0], true)
    assert.equal(!!data.users[0].roles[0].id, true)
  })

  await t.test('graphql endpoint with many to one relations', async () => {
    const response = await axios.post(authApplicationUrl, {
      query: `{
        products {
          id
          families {
            id
          }
        }
      }`,
    })
    assert.equal(response.status, 200)
    assert.equal(!!response.data, true)
    const data = response.data.data
    assert.equal(!!data.products[0], true)
    assert.equal(!!data.products[0].id, true)
    assert.equal(!!data.products[0].families, true)
    assert.equal(!!data.products[0].families.id, true)
  })

  await t.test('graphql endpoint with one to many relations', async () => {
    const response = await axios.post(authApplicationUrl, {
      query: `{
        families {
          id
          products {
            id
          }
        }
      }`,
    })
    assert.equal(response.status, 200)
    assert.equal(!!response.data, true)
    const data = response.data.data
    assert.equal(!!data.families[0], true)
    assert.equal(!!data.families[0].id, true)
    assert.equal(!!data.families[0].products[0], true)
    assert.equal(!!data.families[0].products[0].id, true)
  })
  await t.test('graphql endpoint with one to many relations with child filter', async () => {
    const response = await axios.post(authApplicationUrl, {
      query: `{
        families {
          id
          products (filter: { id: { _eq: 1}}) {
            id
          }
        }
      }`,
    })
    assert.equal(response.status, 200)
    assert.equal(!!response.data, true)
    const data = response.data.data
    assert.equal(!!data.families[0], true)
    assert.equal(!!data.families[0].id, true)
    assert.equal(!!data.families[0].products, true)
  })
  
  await t.test('graphql pagination', async () => {
    const response = await axios.post(authApplicationUrl, {
      query: `{
        users(take:1, skip: 1) {
          id
        }
      }`,
    })
    assert.equal(response.status, 200)
    assert.equal(!!response.data, true)
    const data = response.data.data
    assert.equal(!!data.users, true)
    assert.equal(!!data.users[0].id, true)
  })
})
