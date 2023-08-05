import { Router } from 'express'
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs'
import { Funfunz } from '../index.js'
import { createHandler } from 'graphql-http/lib/use/express'

class IndexRouter {
  public router: Router
  constructor(funfunz: Funfunz) {
    const graph = createHandler({
      schema: () => {
        return funfunz.schemaManager.getSchemas().api
      },
      context: (req, args) => {
        return {req:req.raw, args}
      }
    })
    this.router = Router()
    this.router.use(
      graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
      graph
    )
  }

  public getRouter(): Router {
    return this.router
  }
}

export default IndexRouter
