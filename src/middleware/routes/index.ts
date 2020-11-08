import GraphQLSchema from '../graphql/schema'
import { Router } from 'express'
import { graphqlHTTP } from 'express-graphql'
import { execute, parse, GraphQLSchema as Schema, ExecutionResult } from 'graphql'
import { isPromise } from '../utils/index'

let schema: Schema

export const globalGraph = (document: string): Promise<ExecutionResult> => {
  const result = execute({
    schema,
    document: parse(document),
    contextValue: {
      superUser: true
    }
  })
  if (isPromise<ExecutionResult>(result)) {
    return result
  }
  return Promise.resolve<ExecutionResult>(result)
}

class IndexRouter {
  public router: Router
  constructor() {
    schema = GraphQLSchema()
    const graph = graphqlHTTP(
      (req: unknown, res) => {
        return {
          context: {
            req,
            res,
            user: (req as Record<string, unknown>).user,
          },
          graphiql: {
            headerEditorEnabled: true
          },
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
