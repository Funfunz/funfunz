import { GraphQLList, GraphQLFloat, GraphQLInt } from 'graphql'
import test from 'node:test'
import assert from 'node:assert'
import { Funfunz } from '../middleware/index.js'
import config from './configs/config.js'
import entities from './configs/entities.js'
import axios from 'axios'
import { authenticatedServer, closeConnections, server } from './utils.js'

let randomNumberCount = 4

let familyTestName = 'TestFamily'
let familyTestUpdateName = 'TestedFamily'
let familyId: number

let authFunfunz
let authApplication
let simpleFunfunz
let application
let authApplicationUrl
let simpleApplicationUrl

test('api', async (t) => {
  t.before(() => {
    authFunfunz = new Funfunz({
      config,
      entities,
      queries: {
        randomNumbers: {
          type: new GraphQLList(GraphQLFloat),
          description: 'This will return a list of random numbers.',
          resolve: () => {
            return Array.from({length: randomNumberCount}, () => Math.random())
          },
        }
      },
      mutations: {
        increaseRandomNumber: {
          type: GraphQLInt,
          description: 'This will increase and return the quantity of random numbers.',
          resolve: () => {
            return randomNumberCount += 1
          },
        },
        decreaseRandomNumber: {
          type: GraphQLInt,
          description: 'This will decrease and return the quantity of random numbers.',
          resolve: () => {
            return randomNumberCount -= 1
          },
        }
      }
    })
    const authPort = 4012
    authApplication = authenticatedServer(authFunfunz.middleware, authPort)
    authApplicationUrl = 'http://localhost:' + authPort + '/api'
    
    simpleFunfunz = new Funfunz({
      config,
      entities,
    })
    const simplePort = 4013
    application = server(authFunfunz.middleware, simplePort)
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
        closeConnections([authApplication, application], res)
      }
    )
  })

  await t.test('mutation to add families', async () => {
    const response = await axios.post(authApplicationUrl, {
      query: `
      mutation {
        addFamilies (
          data: {
            name: "${familyTestName}"
          }
        ){
          id
          name
        }
      }`,
    })
    assert.equal(response.status, 200)
    assert.equal(!!response.data, true)
    const data = response.data.data
    assert.equal(Array.isArray(data.addFamilies), true)
    assert.equal(!!data.addFamilies[0].id, true)
    assert.equal(!!data.addFamilies[0].name, true)
    assert.equal(data.addFamilies[0].name, familyTestName)
    familyId = data.addFamilies[0].id
  })

  await t.test('update created family', async () => {
    const response = await axios.post(authApplicationUrl, {
      query: `
      mutation {
        updateFamilies (
          take: 1
          skip: 0
          filter: {
            id: {
              _eq: ${familyId}
            }
          }
          data: {
            name: "${familyTestUpdateName}"
          }
        ){
          id
          name
        }
      }`,
  })
    
    
  assert.equal(response.status, 200)
  assert.equal(!!response.data, true)
  const data = response.data.data
  assert.equal(!!Array.isArray(data.updateFamilies), true)
  assert.equal(!!data.updateFamilies[0].id, true)
  assert.equal(!!data.updateFamilies[0].name, true)
  assert.equal(data.updateFamilies[0].name, familyTestUpdateName)
  })

  await t.test('delete created family', async () => {
    const response = await axios.post(authApplicationUrl, {
      query: `
      mutation {
        deleteFamilies (
          filter: {
            id: {
              _eq: ${familyId}
            }
          }
        ){
          deleted
        }
      }`,
    })
    assert.equal(response.status, 200)
    assert.equal(!!response.data, true)
    const data = response.data.data
    assert.equal(!!data.deleteFamilies, true)
    assert.equal(data.deleteFamilies.deleted, 1)
  })
  await t.test('update product price', async () => {
    const response = await axios.post(authApplicationUrl, {
      query: `
      mutation {
        updateProducts (
          take: 1
          skip: 0
          filter: {
            id: {
              _eq: 1
            }
          }
          data: {
            price: 1.2
          }
        ){
          id
          price
        }
      }`,
    })
    assert.equal(response.status, 200)
    assert.equal(!!response.data, true)
    const data = response.data.data
    assert.equal(!!Array.isArray(data.updateProducts), true)
    assert.equal(!!data.updateProducts[0].id, true)
    assert.equal(data.updateProducts[0].price, 1.2)
  })
  await t.test('query data', async () => {
    const response = await axios.post(authApplicationUrl, {
      query: `
      query {
        families (
          filter: {
            id: {
              _eq: 1
            }
          }
        ){
          id
          products (
            filter: {
              _and: [
                {
                  id: {
                    _in: [1,2,3,4]
                  }
                }
                {
                  _or: [
                    {
                      name: {
                        _like: "name1"
                      }
                    }
                    {
                      name: {
                        _like: "name2"
                      }
                    }
                  ]
                }
              ]
            }
          ){
            id
            name
            FamilyId
            families {
              id
            }
          }
        }
      }`,
    })
    assert.equal(response.status, 200)
    assert.equal(!!response.data, true)
    const data = response.data.data
    assert.notStrictEqual(data, {
      families: [
        {
          id: 1,
          products: [
            {
              id: 1,
              name: 'name1',
              FamilyId: 1,
              families: {
                id: 1
              }
            },
            {
              id: 2,
              name: "name2",
              FamilyId: 1,
              families: {
                id: 1
              }
            }
          ]
        }
      ]
    })
  })

  await t.test('query no data result', async () => {
    const response = await axios.post(authApplicationUrl, {
      query: `
      query {
        families (
          filter: {
            id: {
              _eq: 1234
            }
          }
        ){
          id
          name
        }
      }`,
    })
    assert.equal(response.status, 200)
    assert.equal(!!response.data, true)
    const data = response.data.data
    assert.equal(Array.isArray(data.families), true)
    assert.equal(data.families.length, 0)
  })

  await t.test('query count data', async () => {
    const response = await axios.post(authApplicationUrl, {
      query: `
      query {
        imagesCount
      }`,
    })
    assert.equal(response.status, 200)
    assert.equal(!!response.data, true)
    const data = response.data.data
    assert.equal(data.imagesCount, 102)
  })

  await t.test('query secure data', async () => {
    const response = await axios.post(authApplicationUrl, {
      query: `
      query {
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
    assert.equal(!!data, true)
    assert.equal(!!data.users, true)
    assert.equal(!!data.users[0], true)
    assert.equal(!!data.users[0].id, true)
    const userWithRoles = data.users.find(u => u.roles && u.roles.length)
    assert.equal(!!userWithRoles.roles[0].id, true)
  })

  await t.test('query secure data unauthorized', async () => {
    const response = await axios.post(simpleApplicationUrl, {
      query: `
      query {
        users {
          id
        }
      }`,
    })
    assert.equal(response.status, 200)
    assert.equal(!!response.data, true)
    const errors = response.data.errors
    assert.equal(errors[0].message, 'Not authorized')
  })

  await t.test('should be possible to call custom graphql queries', async () => {
    const response = await axios.post(authApplicationUrl, {
      query: `{
        randomNumbers
      }`,
    })
    assert.equal(response.status, 200)
    assert.equal(!!response.data, true)
    const data = response.data.data
    assert.equal(!!data.randomNumbers, true)
    assert.equal(data.randomNumbers.length, 4)
  })
  await t.test('should be possible to call custom graphql mutations', async () => {
    return axios.post(authApplicationUrl, {
      query: `
        mutation {
          increaseRandomNumber
        }
      `,
    }).then(
      (response) => {
        assert.equal(response.status, 200)
        assert.equal(!!response.data, true)
        const data = response.data.data
        assert.equal(data.increaseRandomNumber, 5)
      }
    ).catch(
      () => {
        console.log('error')
      }
    )
  })
})