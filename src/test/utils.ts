/* istanbul ignore file */
import express, { Express } from 'express'
import { Server } from 'node:http'
import { Funfunz } from '../index.js'

interface IServerInstance {server: Server, port: number}

export function authenticatedServer(funfunz: Express, port: number): Server {
  const server = express()
  server.use((req: any, res, next) => {
    req.user = {
      id: 1,
      email: 'jwebcoder@mymail.com',
      name: 'João Moura',
      roles: [
        { id: 1, name: 'aunthenticated' },
        { id: 2, name: 'member' },
        { id: 3, name: 'admin' },
      ],
    }
    next()
  })
  server.use(funfunz)
  return server.listen(port)
}

export function server(funfunz: Express, port: number): Server {
  const server = express()
  server.use(funfunz)
  return server.listen(port)
}

export function stopDataConnectors(instances: Funfunz[]) {
  instances.forEach(
    (instance) => {
      instance.stopDataConnectors()
    }
  )
}

export function closeConnections(servers: Server[], cb: (boolean) => void) {
  if (servers.length === 0) {
    return
  }
  const server = servers.pop() as Server

  server.closeAllConnections()
  server.close(
  (error) => {
    if (error) {
      console.log({error})
    }
    if (servers.length) {
      return closeConnections(servers, cb)
    }
    return cb(true)
  })
}