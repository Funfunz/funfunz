import { Router } from 'express'
import { graphqlHTTP } from 'express-graphql'
import { graphqlUploadExpress } from 'graphql-upload'
import { Funfunz } from '../index'

class IndexRouter {
  public router: Router
  constructor(funfunz: Funfunz) {
    const graph = graphqlHTTP(
      (req: unknown, res: unknown) => {
        return {
          context: {
            req,
            res,
          },
          graphiql: {
            headerEditorEnabled: true
          },
          schema: funfunz.schema
        }
      }
    )
    this.router = Router()
    this.router.use(
      '/',
      graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
      graph
    )
  }

  public getRouter(): Router {
    return this.router
  }
}

export default IndexRouter
