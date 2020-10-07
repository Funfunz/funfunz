import GraphQLSchema from '../graphql/schema'
import { Router } from 'express'
import { graphqlHTTP } from 'express-graphql'

class IndexRouter {
  public router: Router
  constructor(router?: Router) {
    this.router = router || Router()
    this.router.use(
      '/',
      graphqlHTTP((req: any, res: any) => ({
        context: {
          req,
          res,
          user: req.user,
        },
        graphiql: true,
        schema: GraphQLSchema(),
      }))
    )
  }

  public getRouter(): Router {
    return this.router
  }
}

export default IndexRouter
