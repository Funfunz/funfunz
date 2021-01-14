import Debug from 'debug'
import { GraphQLSchema, GraphQLObjectType, GraphQLFieldConfigMap, Thunk } from 'graphql'
import type { IFunfunzConfig } from '../types'
import { buildMutations } from './mutations'
import { buildQueries } from './queries'
const debug = Debug('funfunz:graphql-schema')

export type getSchemas = SchemaManager<unknown>['getSchemas']

export type TSchemaOptions<Context> = {
  queries?: IFunfunzConfig['queries']
  mutations?: IFunfunzConfig['mutations']
  global?: boolean
  context?: Context
}

type SchemaObject = {
  queries: GraphQLFieldConfigMap<unknown, unknown>,
  mutations: GraphQLFieldConfigMap<unknown, unknown>,
  schema: GraphQLSchema
}

export type SchemaObjectMap = {
  main: GraphQLSchema,
  global: GraphQLSchema
}

export class SchemaManager<OptionsContext> {
  mainSchema!: SchemaObject
  globalSchema!: SchemaObject

  constructor(options: TSchemaOptions<OptionsContext>) {
    this.generateSchema(options)
  }

  getSchemas(): SchemaObjectMap {
    return {
      main: this.mainSchema.schema,
      global: this.globalSchema.schema,
    }
  }

  generateSchema<OptionsContext>(options: TSchemaOptions<OptionsContext>): void {
    this.mainSchema = this.buildGraphQLSchema<OptionsContext>(options)
    this.globalSchema = this.buildGraphQLSchema<OptionsContext>({
      ...options,
      global: true,
    })
  }

  addQuery<TSource, TContext>(id: 'main' | 'global', query: Thunk<GraphQLFieldConfigMap<TSource, TContext>>): void {
    console.log('add query', id, query)
  }

  /* TODO
  updateQuery() {

  }

  removeQuery() {

  }

  addMutation() {

  }

  updateMutation() {

  }

  removeMutation() {
    
  }
  */

  private buildGraphQLSchema<OptionsContext> (
    options: TSchemaOptions<OptionsContext>
  ): SchemaObject {
    debug('Creating graphql schema')
    // lets define our root query
    const queries = {
      ...buildQueries<OptionsContext>(this, options),
      ...options?.queries
    }
    const RootQuery = new GraphQLObjectType({
      name: 'Query',
      fields: queries,
    })
    
    const mutations = {
      ...buildMutations<OptionsContext>(this, options),
      ...options?.mutations
    }
    const RootMutation = new GraphQLObjectType({
      name: 'Mutation',
      fields: mutations,
    })
  
    return {
      queries,
      mutations,
      schema: new GraphQLSchema({
        query: RootQuery,
        mutation: RootMutation,
      })
    }
  }
}