import { GraphQLString } from 'graphql'
import request from 'supertest'
import { Funfunz } from '../middleware/index.js'
import test from 'node:test'
import assert from 'node:assert'

import config from './configs/config.js'
import entities from './configs/entities.js'

const funfunz = new Funfunz({
  config,
  entities
})

const application = funfunz.middleware

const queryName = 'jejayQuery'
const queryDescription = 'query created during runtime'
    
const mutationName = 'jejayMutation'
const mutationDescription = 'mutation created during runtime'

test('schema manager', async (t) => {
  await t.test('should be possible to add new queries and mutations during runtime', async () => {
    funfunz.schemaManager.addOrUpdateQuery({
      [queryName]: {
        description: queryDescription,
        type: GraphQLString,
        resolve: () => {
          return queryDescription
        },
      }
    })

    funfunz.schemaManager.addOrUpdateQuery({
      [queryName + 'API']: {
        description: queryDescription,
        type: GraphQLString,
        resolve: () => {
          return queryDescription
        },
      }
    }, 'api')

    funfunz.schemaManager.addOrUpdateQuery({
      [queryName + 'LOCAL']: {
        description: queryDescription,
        type: GraphQLString,
        resolve: () => {
          return queryDescription
        },
      }
    }, 'local')

    funfunz.schemaManager.addOrUpdateMutation({
      [mutationName]: {
        description: mutationDescription,
        type: GraphQLString,
        resolve: () => {
          return mutationDescription
        },
      }
    })

    funfunz.schemaManager.addOrUpdateMutation({
      [mutationName + 'API']: {
        description: mutationDescription,
        type: GraphQLString,
        resolve: () => {
          return mutationDescription
        },
      }
    }, 'api')

    funfunz.schemaManager.addOrUpdateMutation({
      [mutationName + 'LOCAL']: {
        description: mutationDescription,
        type: GraphQLString,
        resolve: () => {
          return mutationDescription
        },
      }
    }, 'local')
    assert.equal(funfunz.schemaManager.listQueries().api.indexOf(queryName) > -1, true)
    assert.equal(funfunz.schemaManager.listQueries().api.indexOf(queryName + 'LOCAL'), -1)
    assert.equal(funfunz.schemaManager.listMutations().api.indexOf(mutationName) > -1, true)
    assert.equal(funfunz.schemaManager.listMutations().api.indexOf(mutationName + 'LOCAL'), -1)
    assert.equal(funfunz.schemaManager.listQueries().local.indexOf(queryName) > -1, true)
    assert.equal(funfunz.schemaManager.listQueries().local.indexOf(queryName + 'API'),-1)
    assert.equal(funfunz.schemaManager.listMutations().local.indexOf(mutationName) > -1, true)
    assert.equal(funfunz.schemaManager.listMutations().local.indexOf(mutationName + 'API'), -1)

    return new Promise(
      (res, rej) => {
        request(application)
          .post('/')
          .send({
            query: `{
              ${queryName}
            }`,
          })
          .set('Accept', 'application/json').end(
            (err, response) => {
              if (err) {
                rej(err)
              }
              assert.equal(response.status, 200, `Status is ${response.status} instead of 200`)
              assert.equal(!!response.body, true)
              const data = response.body.data
              assert.equal(!!data[queryName], true)
              assert.equal(data[queryName], queryDescription)
              res(true)
            }
        )
      }
    ).then(
      () => {
        return new Promise(
          (res, rej) => {
            request(application)
              .post('/')
              .send({
                query: `mutation {${mutationName}}`,
              })
              .set('Accept', 'application/json').end(
                (err, response) => {
                  if (err) {
                    rej(err)
                  }
                  assert.equal(response.status, 200)
                  assert.equal(!!response.body, true)
                  const data = response.body.data
                  assert.equal(!!data[mutationName], true)
                  assert.equal(data[mutationName], mutationDescription)
                  res(true)
                }
              )
          }
        )
      }
    ).then(
      () => {
        return true
      }
    ).catch(
      (err) => {
        return err
      }
    )
  })

  await t.test('should be possible to remove queries and mutations during runtime', () => {
    assert.equal(funfunz.schemaManager.removeQuery(queryName, 'api'), 1)
    assert.equal(funfunz.schemaManager.removeQuery(queryName), 1)
    assert.equal(funfunz.schemaManager.removeMutation(mutationName, 'api'), 1)
    assert.equal(funfunz.schemaManager.removeMutation(mutationName), 1)

    assert.equal(funfunz.schemaManager.listQueries().api.indexOf(queryName), -1)
    assert.equal(funfunz.schemaManager.listMutations().api.indexOf(mutationName), -1)
    
    assert.equal(funfunz.schemaManager.listQueries().local.indexOf(queryName), -1)
    assert.equal(funfunz.schemaManager.listMutations().local.indexOf(mutationName), -1)
    return new Promise(
      (res, rej) => {
        request(application)
          .post('/')
          .send({
            query: `{
              ${queryName}
            }`,
          })
          .set('Accept', 'application/json').end(
            (err, response) => {
              if (err) {
                rej(err)
              }

              assert.equal(response.status, 200)
              assert.equal(!!response.body, true)
              const errors = response.body.errors
              assert.equal(errors[0].message.indexOf(`Cannot query field "${queryName}" on type "Query".`) > -1, true)
              res(true)
            }
        )
      }
    ).then(
      () => {
        return new Promise(
          (res, rej) => {
            request(application)
              .post('/')
              .send({
                query: `mutation {${mutationName}}`,
              })
              .set('Accept', 'application/json').end(
                (err, response) => {
                  if (err) {
                    rej(err)
                  }
                  assert.equal(response.status, 400)
                  assert.equal(!!response.body, true)
                  const errors = response.body.errors
                  assert.equal(errors[0].message.indexOf(`Cannot query field "${mutationName}" on type "Mutation".`) > -1, true)
                  res(true)
                }
              )
          }
        )
      }
    ).then(
      () => {
        return true
      }
    ).catch(
      (err) => {
        return err
      }
    )
  })
})