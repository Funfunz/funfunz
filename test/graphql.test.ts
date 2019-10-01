import request from 'supertest'
import app from '../src/api'

import config from './configs/MCconfig'
import settings from './configs/MCsettings'

import { authenticatedServer } from './utils'

const application = app({
  config,
  settings,
  plugin: true,
})
const authApplication = authenticatedServer(application)

describe('graphql', () => {
  it('graphql endpoint should return status 200', (done) => {
    return request(application)
      .post('/graphql')
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
          return done(err)
        }
        expect(response.status).toBe(200)
        return done()
      }
    )
  })
  it('graphql endpoint with deep queries should return 200', (done) => {
    return request(application)
      .post('/graphql')
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
          return done(err)
        }
        expect(response.status).toBe(200)
        return done()
      }
    )
  })

  it('graphql endpoint with recursive deep queries should return 200', (done) => {
    return request(application)
      .post('/graphql')
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
          return done(err)
        }
        expect(response.status).toBe(200)
        return done()
      }
    )
  })

  it('graphql endpoint filter with null should return 200', (done) => {
    return request(application)
      .post('/graphql')
      .send({
        query: `{
          families (order: null, imageUrl: null) {
            id
          }
          families (imageUrl: null, order: null) {
            name
          }
        }`,
      })
      .set('Accept', 'application/json').end(
      (err, response) => {
        if (err) {
          return done(err)
        }
        expect(response.status).toBe(200)
        return done()
      }
    )
  })

  it('graphql endpoint with unauthorized access', (done) => {
    return request(application)
      .post('/graphql')
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
          return done(err)
        }
        expect(response.status).toBe(200)
        expect(response.body.errors[0].message).toEqual('Not authorized')
        return done()
      }
    )
  })

  it('graphql endpoint with many to many relations', (done) => {
    return request(authApplication)
      .post('/graphql')
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
          return done(err)
        }
        expect(response.status).toBe(200)
        expect(response.body).toBeTruthy()
        const data = response.body.data
        expect(data.users[0]).toBeTruthy()
        expect(data.users[0].id).toBeTruthy()
        expect(data.users[0].roles[0]).toBeTruthy()
        expect(data.users[0].roles[0].id).toBeTruthy()
        return done()
      }
    )
  })

  it('graphql endpoint with many to one relations', (done) => {
    return request(application)
      .post('/graphql')
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
          return done(err)
        }
        expect(response.status).toBe(200)
        expect(response.body).toBeTruthy()
        const data = response.body.data
        expect(data.products[0]).toBeTruthy()
        expect(data.products[0].id).toBeTruthy()
        expect(data.products[0].families).toBeTruthy()
        expect(data.products[0].families.id).toBeTruthy()
        return done()
      }
    )
  })
  it('graphql endpoint with one to many relations', (done) => {
    return request(application)
      .post('/graphql')
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
          return done(err)
        }
        expect(response.status).toBe(200)
        expect(response.body).toBeTruthy()
        const data = response.body.data
        expect(data.families[0]).toBeTruthy()
        expect(data.families[0].id).toBeTruthy()
        expect(data.families[0].products[0]).toBeTruthy()
        expect(data.families[0].products[0].id).toBeTruthy()
        return done()
      }
    )
  })
  it('graphql endpoint with one to many relations with child filter', (done) => {
    return request(application)
      .post('/graphql')
      .send({
        query: `{
          families {
            id
            products (id: 1) {
              id
            }
          }
        }`,
      })
      .set('Accept', 'application/json').end(
      (err, response) => {
        if (err) {
          return done(err)
        }
        expect(response.status).toBe(200)
        expect(response.body).toBeTruthy()
        const data = response.body.data
        expect(data.families[0]).toBeTruthy()
        expect(data.families[0].id).toBeTruthy()
        expect(data.families[0].products).toBeTruthy()
        return done()
      }
    )
  })
  it('graphql endpoint with mutation to add users', (done) => {
    return request(authApplication)
      .post('/graphql')
      .send({
        query: `mutation {
          addUsers (name: "Francisco",email: "francisco@mail.com") {
            id
            name
            email
            createdAt
            updatedAt
          }
        }`,
      })
      .set('Accept', 'application/json').end(
      (err, response) => {
        if (err) {
          return done(err)
        }
        expect(response.status).toBe(200)
        expect(response.body).toBeTruthy()
        const data = response.body.data
        expect(data.addUsers).toBeTruthy()
        expect(data.addUsers.id).toBeTruthy()
        expect(data.addUsers.name).toBeTruthy()
        expect(data.addUsers.email).toBeTruthy()
        expect(data.addUsers.createdAt).toBeTruthy()
        expect(data.addUsers.updatedAt).toBeTruthy()
        return done()
      }
    )
  })
  it('graphql endpoint with mutation to add roles', (done) => {
    return request(authApplication)
      .post('/graphql')
      .send({
        query: `mutation {
          addRoles(name:"test") {
            id
          }
        }`,
      })
      .set('Accept', 'application/json').end(
      (err, response) => {
        if (err) {
          return done(err)
        }
        expect(response.status).toBe(200)
        expect(response.body).toBeTruthy()
        const data = response.body.data
        expect(data.addRoles).toBeTruthy()
        expect(data.addRoles.id).toBeTruthy()
        return done()
      }
    )
  })
  it('graphql endpoint with mutation to add many to many relations', (done) => {
    return request(authApplication)
      .post('/graphql')
      .send({
        query: `mutation {
          addUsersroles(userId: 2, roleId: 3) {
            userId
            roleId
          }
        }`,
      })
      .set('Accept', 'application/json').end(
      (err, response) => {
        if (err) {
          return done(err)
        }
        expect(response.status).toBe(200)
        expect(response.body).toBeTruthy()
        const data = response.body.data
        expect(data.addUsersroles).toBeTruthy()
        expect(data.addUsersroles.userId).toBeTruthy()
        expect(data.addUsersroles.roleId).toBeTruthy()
        return done()
      }
    )
  })
  it('graphql endpoint with mutation to add many to many relations', (done) => {
    return request(authApplication)
      .post('/graphql')
      .send({
        query: `mutation {
          updateUsers(id: 3, name: "Name from test") {
            id
            name
          }
        }`,
      })
      .set('Accept', 'application/json').end(
      (err, response) => {
        if (err) {
          return done(err)
        }
        expect(response.status).toBe(200)
        expect(response.body).toBeTruthy()
        const data = response.body.data
        expect(data.updateUsers).toBeTruthy()
        expect(data.updateUsers.id).toBeTruthy()
        expect(data.updateUsers.name).toEqual('Name from test')
        return done()
      }
    )
  })
  it('graphql endpoint with mutation to add many to many relations', (done) => {
    return request(authApplication)
      .post('/graphql')
      .send({
        query: `mutation {
          deleteUsers(id: 3) {
            success
          }
        }`,
      })
      .set('Accept', 'application/json').end(
      (err, response) => {
        if (err) {
          return done(err)
        }
        expect(response.status).toBe(200)
        expect(response.body).toBeTruthy()
        const data = response.body.data
        expect(data.deleteUsers).toBeTruthy()
        expect(data.deleteUsers.success).toBeTruthy()
        return done()
      }
    )
  })
})
