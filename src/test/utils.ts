/* istanbul ignore file */
import express, { Express } from 'express'
import { Server } from 'node:http'

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
