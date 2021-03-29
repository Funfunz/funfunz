import { GraphQLString } from 'graphql'
import request from 'supertest'
import { Funfunz } from '../middleware'

import config from './configs/config'
import entities from './configs/entities'

const funfunz = new Funfunz({
  config,
  entities
})

const application = funfunz.middleware

const queryName = 'jejayQuery'
const queryDescription = 'query created during runtime'
    
const mutationName = 'jejayMutation'
const mutationDescription = 'mutation created during runtime'

describe('schema manager', () => {
  it('should be possible to add new queries and mutations during runtime', (done) => {
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
    expect(funfunz.schemaManager.listQueries().api.indexOf(queryName)).toBeGreaterThan(-1)
    expect(funfunz.schemaManager.listQueries().api.indexOf(queryName + 'LOCAL')).toBe(-1)
    expect(funfunz.schemaManager.listMutations().api.indexOf(mutationName)).toBeGreaterThan(-1)
    expect(funfunz.schemaManager.listMutations().api.indexOf(mutationName + 'LOCAL')).toBe(-1)
    
    expect(funfunz.schemaManager.listQueries().local.indexOf(queryName)).toBeGreaterThan(-1)
    expect(funfunz.schemaManager.listQueries().local.indexOf(queryName + 'API')).toBe(-1)
    expect(funfunz.schemaManager.listMutations().local.indexOf(mutationName)).toBeGreaterThan(-1)
    expect(funfunz.schemaManager.listMutations().local.indexOf(mutationName + 'API')).toBe(-1)

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
              expect(response.status).toBe(200)
              expect(response.body).toBeTruthy()
              const data = response.body.data
              expect(data[queryName]).toBeTruthy()
              expect(data[queryName]).toBe(queryDescription)
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
                  expect(response.status).toBe(200)
                  expect(response.body).toBeTruthy()
                  const data = response.body.data
                  expect(data[mutationName]).toBeTruthy()
                  expect(data[mutationName]).toBe(mutationDescription)
                  res(true)
                }
              )
          }
        )
      }
    ).then(
      () => {
        done()
      }
    ).catch(
      (err) => {
        done(err)
      }
    )
  })

  it('should be possible to remove queries and mutations during runtime', (done) => {
    expect(funfunz.schemaManager.removeQuery(queryName, 'api')).toBe(1)
    expect(funfunz.schemaManager.removeQuery(queryName)).toBe(1)
    expect(funfunz.schemaManager.removeMutation(mutationName, 'api')).toBe(1)
    expect(funfunz.schemaManager.removeMutation(mutationName)).toBe(1)

    expect(funfunz.schemaManager.listQueries().api.indexOf(queryName)).toBe(-1)
    expect(funfunz.schemaManager.listMutations().api.indexOf(mutationName)).toBe(-1)
    
    expect(funfunz.schemaManager.listQueries().local.indexOf(queryName)).toBe(-1)
    expect(funfunz.schemaManager.listMutations().local.indexOf(mutationName)).toBe(-1)
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

              expect(response.status).toBe(400)
              expect(response.body).toBeTruthy()
              const errors = response.body.errors
              expect(errors[0].message).toContain(`Cannot query field "${queryName}" on type "Query".`)
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
                  expect(response.status).toBe(400)
                  expect(response.body).toBeTruthy()
                  const errors = response.body.errors
                  expect(errors[0].message).toContain(`Cannot query field "${mutationName}" on type "Mutation".`)
                  res(true)
                }
              )
          }
        )
      }
    ).then(
      () => {
        done()
      }
    ).catch(
      (err) => {
        done(err)
      }
    )
  })
})