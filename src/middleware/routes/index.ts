import { Response, Request, Router } from 'express'
import httpError from 'http-errors'
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs'
import { Funfunz } from '../index.js'
import { execute, parse } from 'graphql'
import { parseBody } from './parseBody.js'
import { graphqlHTTP } from '@bluesialia/express-graphql'

class IndexRouter {
  public router: Router
  constructor(funfunz: Funfunz) {
    const graph = graphqlHTTP(
      (req: Request, res: Response) => {
        return {
          context: {
            req,
            res,
          },
          graphiql: funfunz.config().config.graphiql ? 
            { headerEditorEnabled: true }
            : false,
          schema: funfunz.schemaManager.getSchemas().api
        }
      }
    )
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
