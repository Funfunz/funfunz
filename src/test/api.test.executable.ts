import { GraphQLList, GraphQLFloat, GraphQLInt } from 'graphql'
import request from 'supertest'
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
const authPort = 4052
const authApplication = authenticatedServer(application, authPort)

let familyTestName = 'TestFamily'

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
.set('Accept', 'application/json')
.then(
  (response) => {
    assert.equal(response.status, 200)
    assert.equal(!!response.body, true)
    const data = response.body.data
    assert.equal(!!data, true)
    assert.equal(!!data.addFamilies, true)
    assert.equal(Array.isArray(data.addFamilies), true)
    assert.equal(!!data.addFamilies[0].id, true)
    assert.equal(!!data.addFamilies[0].name, true)
    assert.equal(data.addFamilies[0].name, familyTestName)
    throw 'error'
  }
)
