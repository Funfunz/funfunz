import GraphQLSchema from '../graphql/schema'
import { Router } from 'express'
import { graphqlHTTP } from 'express-graphql'


class IndexRouter {
  public router: Router
  constructor() {
    const schema = GraphQLSchema()
    const graph = graphqlHTTP(
      (req: unknown, res) => {
        return {
          context: {
            req,
            res,
            user: (req as Record<string, unknown>).user,
          },
          graphiql: true,
          schema
        }
      }
    )
    
    this.router = Router()
    this.router.use(
      '/',
      graph
    )
  }

  public getRouter(): Router {
    return this.router
  }
}

export default IndexRouter
