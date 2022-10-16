import { GraphQLList, GraphQLFloat, GraphQLInt } from 'graphql'
import request from 'supertest'
import test from 'node:test'
import assert from 'node:assert'
import { Funfunz } from '../middleware/index.js'
import config from './configs/config.js'
import entities from './configs/entities.js'

import { authenticatedServer } from './utils.js'

let randomNumberCount = 4

const application = new Funfunz({
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
}).middleware
const authApplication = authenticatedServer(application)

let familyTestName = 'TestFamily'
let familyTestUpdateName = 'TestedFamily'
let familyId: number

test('graphql', async (t) => {
  await t.test('mutation to add families', () => {
    return new Promise(
      (res, rej) => {
        request(authApplication)
        .post('/api')
        .send({
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
        .set('Accept', 'application/json').end(
          (err, response) => {
            if (err) {
              console.log('err')
              return res(err)
            }
            console.log('test')
            assert.equal(response.status, 200)
            assert.equal(response.body, true)
            const data = response.body.data
            assert.equal(Array.isArray(data.addFamilies), true)
            assert.equal(data.addFamilies[0].id, true)
            assert.equal(data.addFamilies[0].name, true)
            assert.equal(data.addFamilies[0].name, familyTestName)
            familyId = data.addFamilies[0].id
            return res(true)
          }
        )
      }
    )
  })

  await t.test('update created family', () => {
    return new Promise(
      (res, rej) => {
        request(authApplication)
        .post('/api')
        .send({
          query: `
          mutation {
            rej        }
              data: {
                name: "${familyTestUpdateName}"
              }
            ){
              id
              name
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
            assert.equal(!!Array.isArray(data.updateFamilies), true)
            assert.equal(!!data.updateFamilies[0].id, true)
            assert.equal(!!data.updateFamilies[0].name, true)
            assert.equal(data.updateFamilies[0].name, familyTestUpdateName)
            return res(true)
          }
        )
      }
    )
  })
  await t.test('delete created family', () => {
    return new Promise(
      (res, rej) => {
        request(authApplication)
        .post('/api')
        .send({
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
        .set('Accept', 'application/json').end(
          (err, response) => {
            if (err) {
              return rej(err)
            }
            assert.equal(response.status, 200)
            assert.equal(!!response.body, true)
            const data = response.body.data
            assert.equal(!!data.deleteFamilies, true)
            assert.equal(data.deleteFamilies.deleted, 1)
            return res(true)
          }
        )
      }
    )
  })
  await t.test('update product price', () => {
    return new Promise(
      (res, rej) => {
        request(authApplication)
        .post('/api')
        .send({
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
        .set('Accept', 'application/json').end(
          (err, response) => {
            if (err) {
              return rej(err)
            }
            assert.equal(response.status, 200)
            assert.equal(!!response.body, true)
            const data = response.body.data
            assert.equal(!!Array.isArray(data.updateProducts), true)
            assert.equal(!!data.updateProducts[0].id, true)
            assert.equal(data.updateProducts[0].price, 1.2)
            return res(true)
          }
        )
      }
    )
  })
  await t.test('query data', () => {
    return new Promise(
      (res, rej) => {
        request(authApplication)
        .post('/api')
        .send({
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
        .set('Accept', 'application/json').end(
          (err, response) => {
            if (err) {
              return rej(err)
            }
            assert.equal(response.status, 200)
            assert.equal(!!response.body, true)
            const data = response.body.data
            assert.equal(data, {
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
            return res(true)
          }
        )
      }
    )
  })

  await t.test('query no data result', () => {
    return new Promise(
      (res, rej) => {
        request(authApplication)
        .post('/api')
        .send({
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
        .set('Accept', 'application/json').end(
          (err, response) => {
            if (err) {
              return rej(err)
            }
            assert.equal(response.status, 200)
            assert.equal(!!response.body, true)
            const data = response.body.data
            assert.equal(data, {
              "families": []
            })
            return res(true)
          }
        )
      }
    )
  })

  await t.test('query count data', () => {
    return new Promise(
      (res, rej) => {
        request(authApplication)
        .post('/api')
        .send({
          query: `
          query {
            imagesCount
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
            assert.equal(data.imagesCount, 102)
            return res(true)
          }
        )
      }
    )
  })

  await t.test('query secure data', () => {
    return new Promise(
      (res, rej) => {
        request(authApplication)
        .post('/api')
        .send({
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
        .set('Accept', 'application/json').end(
          (err, response) => {
            if (err) {
              return rej(err)
            }
            assert.equal(response.status, 200)
            assert.equal(!!response.body, true)
            const data = response.body.data
            assert.equal(!!data, true)
            assert.equal(!!data.users, true)
            assert.equal(!!data.users[0], true)
            assert.equal(!!data.users[0].id, true)
            const userWithRoles = data.users.find(u => u.roles && u.roles.length)
            assert.equal(!!userWithRoles.roles[0].id, true)
            return res(true)
          }
        )
      }
    )
  })

  await t.test('query secure data unauthorized', () => {
    return new Promise(
      (res, rej) => {
        request(application)
        .post('/api')
        .send({
          query: `
          query {
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
            assert.equal(!!response.body, true)
            const errors = response.body.errors
            assert.equal(errors, [
              {
                message: 'Not authorized',
                locations: [
                  {
                    line: 3,
                    column: 9
                  }
                ],
                path:[ 'users' ]
              }
            ])
            return res(true)
          }
        )
      }
    )
  })

  await t.test('should be possible to call custom graphql queries', () => {
    return new Promise(
      (res, rej) => {
        request(application)
        .post('/api')
        .send({
          query: `{
            randomNumbers
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
            assert.equal(!!data.randomNumbers, true)
            assert.equal(data.randomNumbers.length, 4)
            return res(true)
          }
        )
      }
    )
  })
  await t.test('should be possible to call custom graphql mutations', () => {
    return new Promise(
      (res, rej) => {
        request(application)
        .post('/api')
        .send({
          query: `
            mutation {
              increaseRandomNumber
            }
          `,
        })
        .set('Accept', 'application/json').end(
          (err, response) => {
            if (err) {
              return rej(err)
            }
            assert.equal(response.status, 200)
            assert.equal(!!response.body, true)
            const data = response.body.data
            assert.equal(data.increaseRandomNumber, 5)
            return res(true)
          }
        )
      }
    )
  })
})
