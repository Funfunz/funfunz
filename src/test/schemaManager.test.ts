import { GraphQLString } from 'graphql'
import { Funfunz } from '../middleware/index.js'
import test from 'node:test'
import assert from 'node:assert'
import config from './configs/config.js'
import entities from './configs/entities.js'
import { closeConnections, server, stopDataConnectors } from './utils.js'
import axios, { Axios, AxiosError } from 'axios'

const queryName = 'jejayQuery'
const queryDescription = 'query created during runtime'
    
const mutationName = 'jejayMutation'
const mutationDescription = 'mutation created during runtime'

let funfunzInstance
let simpleApplication
let simpleApplicationUrl

test('schemaManager', async (t) => {
  t.before(() => {
    funfunzInstance = new Funfunz({
      config,
      entities
    })
 
    const simplePort = 4043
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
        stopDataConnectors([funfunzInstance])
        closeConnections([simpleApplication], res)
      }
    )
  })
  
  await t.test('should be possible to add new queries and mutations during runtime', async () => {
    funfunzInstance.schemaManager.addOrUpdateQuery({
      [queryName]: {
        description: queryDescription,
        type: GraphQLString,
        resolve: () => {
          return queryDescription
        },
      }
    })

    funfunzInstance.schemaManager.addOrUpdateQuery({
      [queryName + 'API']: {
        description: queryDescription,
        type: GraphQLString,
        resolve: () => {
          return queryDescription
        },
      }
    }, 'api')

    funfunzInstance.schemaManager.addOrUpdateQuery({
      [queryName + 'LOCAL']: {
        description: queryDescription,
        type: GraphQLString,
        resolve: () => {
          return queryDescription
        },
      }
    }, 'local')

    funfunzInstance.schemaManager.addOrUpdateMutation({
      [mutationName]: {
        description: mutationDescription,
        type: GraphQLString,
        resolve: () => {
          return mutationDescription
        },
      }
    })

    funfunzInstance.schemaManager.addOrUpdateMutation({
      [mutationName + 'API']: {
        description: mutationDescription,
        type: GraphQLString,
        resolve: () => {
          return mutationDescription
        },
      }
    }, 'api')

    funfunzInstance.schemaManager.addOrUpdateMutation({
      [mutationName + 'LOCAL']: {
        description: mutationDescription,
        type: GraphQLString,
        resolve: () => {
          return mutationDescription
        },
      }
    }, 'local')
    assert.equal(funfunzInstance.schemaManager.listQueries().api.indexOf(queryName) > -1, true)
    assert.equal(funfunzInstance.schemaManager.listQueries().api.indexOf(queryName + 'LOCAL'), -1)
    assert.equal(funfunzInstance.schemaManager.listMutations().api.indexOf(mutationName) > -1, true)
    assert.equal(funfunzInstance.schemaManager.listMutations().api.indexOf(mutationName + 'LOCAL'), -1)
    assert.equal(funfunzInstance.schemaManager.listQueries().local.indexOf(queryName) > -1, true)
    assert.equal(funfunzInstance.schemaManager.listQueries().local.indexOf(queryName + 'API'),-1)
    assert.equal(funfunzInstance.schemaManager.listMutations().local.indexOf(mutationName) > -1, true)
    assert.equal(funfunzInstance.schemaManager.listMutations().local.indexOf(mutationName + 'API'), -1)
    const response = await axios.post(simpleApplicationUrl, {
      query: `{
        ${queryName}
      }`,
    })
    assert.equal(response.status, 200, `Status is ${response.status} instead of 200`)
    assert.equal(!!response.data, true)
    const dataQuery = response.data.data
    assert.equal(!!dataQuery[queryName], true)
    assert.equal(dataQuery[queryName], queryDescription)
   
  })

  await t.test('should be possible to remove queries and mutations during runtime', async () => {
    assert.equal(funfunzInstance.schemaManager.removeQuery(queryName + 'API', 'api'), 1)
    assert.equal(funfunzInstance.schemaManager.removeQuery(queryName), 2)
    assert.equal(funfunzInstance.schemaManager.removeMutation(mutationName + 'API', 'api'), 1)
    assert.equal(funfunzInstance.schemaManager.removeMutation(mutationName), 2)

    assert.equal(funfunzInstance.schemaManager.listQueries().api.indexOf(queryName + 'API'), -1)
    assert.equal(funfunzInstance.schemaManager.listMutations().api.indexOf(mutationName + 'API'), -1)
    
    assert.equal(funfunzInstance.schemaManager.listQueries().local.indexOf(queryName), -1)
    assert.equal(funfunzInstance.schemaManager.listMutations().local.indexOf(mutationName), -1)
    try {
      await axios.post(simpleApplicationUrl, {
        query: `{
          ${queryName}
        }`,
      })
    } catch (err) {
      if (axios.isAxiosError(err))  {
        assert.equal(err.response?.status, 400)
        assert.equal(!!err.response?.data, true)
        const errorsQuery = err.response?.data.errors
        assert.equal(errorsQuery[0].message.indexOf(`Cannot query field "${queryName}" on type "Query".`) > -1, true)
      }
    }
    
    try {
      await axios.post(simpleApplicationUrl, {
        query: `mutation {${mutationName}}`,
      })
    } catch (err) { 
      if (axios.isAxiosError(err))  {
        assert.equal(err.response?.status, 400)
        assert.equal(!!err.response?.data, true)
        const errorsMutattion = err.response?.data.errors
        assert.equal(errorsMutattion[0].message.indexOf(`Cannot query field "${mutationName}" on type "Mutation".`) > -1, true)
      }
    }
  })
})