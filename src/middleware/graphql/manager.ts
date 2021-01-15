import Debug from 'debug'
import { GraphQLSchema, GraphQLObjectType, GraphQLFieldConfigMap, GraphQLFieldConfig } from 'graphql'
import type { IFunfunzConfig } from '../types'
import { buildMutations } from './mutations'
import { buildQueries } from './queries'
const debug = Debug('funfunz:graphql-schema')

export type getSchemas = SchemaManager<unknown>['getSchemas']

export type TSchemaOptions<Context> = {
  queries?: IFunfunzConfig['queries']
  mutations?: IFunfunzConfig['mutations']
  local?: boolean
  context?: Context
}

type TQueriesList = {
  api: string[]
  local: string[]
}

type SchemaObject<TSource = unknown, TContext = unknown> = {
  queries: GraphQLFieldConfigMap<TSource, TContext>,
  mutations: GraphQLFieldConfigMap<TSource, TContext>,
  schema: GraphQLSchema
}

export type SchemaObjectMap = {
  api: GraphQLSchema,
  local: GraphQLSchema
}

export class SchemaManager<OptionsContext> {
  apiSchema!: SchemaObject
  localSchema!: SchemaObject

  constructor(options: TSchemaOptions<OptionsContext>) {
    this.generateSchema(options)
  }

  getSchemas(): SchemaObjectMap {
    return {
      api: this.apiSchema.schema,
      local: this.localSchema.schema,
    }
  }

  generateSchema<OptionsContext>(options: TSchemaOptions<OptionsContext>): void {
    this.apiSchema = this.buildGraphQLSchema<OptionsContext>(options)
    this.localSchema = this.buildGraphQLSchema<OptionsContext>({
      ...options,
      local: true,
    })
  }

  addOrUpdateQuery<TSource = unknown, TContext = unknown>(query: GraphQLFieldConfigMap<TSource, TContext>, id?: 'api' | 'local'): void {
    Object.entries(query).forEach(
      ([key, value]) => {
        if (id === 'api' || !id) {
          this.apiSchema.queries[key] = value as GraphQLFieldConfig<unknown, unknown>
        }
        if (id === 'local' || !id) {
          this.localSchema.queries[key] = value as GraphQLFieldConfig<unknown, unknown>
        }
        
      }
    )
  }

  listQueries(): TQueriesList {
    return {
      api: Object.keys(this.apiSchema.queries),
      local: Object.keys(this.localSchema.queries),
    }
  }

  removeQuery(queryName: string, id?: 'api' | 'local'): number {
    return id ? Number(this.removeQueryById(queryName, id)) : Number(this.removeQueryById(queryName, 'api')) + Number(this.removeQueryById(queryName, 'local'))
  }

  private removeQueryById(queryName: string, id: 'api' | 'local'): boolean {
    return this[`${id}Schema`].queries[queryName] ? delete this[`${id}Schema`].queries[queryName]: false
  }

  /* TODO

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