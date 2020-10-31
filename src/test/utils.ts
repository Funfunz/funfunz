/* istanbul ignore file */
import express, { Express } from 'express'

export function authenticatedServer(funfunz: Express): Express {
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
  return server
}
