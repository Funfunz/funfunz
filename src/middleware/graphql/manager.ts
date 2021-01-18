import Debug from 'debug'
import { GraphQLSchema, GraphQLObjectType, GraphQLFieldConfigMap, GraphQLFieldConfig, Thunk } from 'graphql'
import { buildMutations } from './mutations'
import { buildQueries } from './queries'
const debug = Debug('funfunz:graphql-schema')

export type getSchemas = SchemaManager<unknown>['getSchemas']

export type TSchemaOptions<Context> = {
  api: {
    queries: Thunk<GraphQLFieldConfigMap<unknown, unknown>>,
    mutations: Thunk<GraphQLFieldConfigMap<unknown, unknown>>,
  },
  local: {
    queries: Thunk<GraphQLFieldConfigMap<unknown, unknown>>,
    mutations: Thunk<GraphQLFieldConfigMap<unknown, unknown>>,
  },
  isLocal?: boolean
  context?: Context
}

export type TSchemaConfig<Context> = {
  queries: Thunk<GraphQLFieldConfigMap<unknown, unknown>>,
  mutations: Thunk<GraphQLFieldConfigMap<unknown, unknown>>,
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
  options: TSchemaOptions<OptionsContext>

  constructor(options: Partial<TSchemaConfig<OptionsContext>>) {
    this.options = {
      ...options,
      api: {
        queries: options.queries || {},
        mutations: options.mutations || {}
      },
      local: {
        queries: options.queries || {},
        mutations: options.mutations || {}
      }
      
      
    }
    this.generateSchema()
  }

  getSchemas(): SchemaObjectMap {
    return {
      api: this.apiSchema.schema,
      local: this.localSchema.schema,
    }
  }

  generateSchema(): void {
    this.apiSchema = this.buildGraphQLSchema(this.options)
    this.localSchema = this.buildGraphQLSchema({
      ...this.options,
      isLocal: true,
    })
  }

  listQueries(): TQueriesList {
    return {
      api: Object.keys(this.apiSchema.queries),
      local: Object.keys(this.localSchema.queries),
    }
  }

  addOrUpdateQuery<TSource = unknown, TContext = unknown>(query: GraphQLFieldConfigMap<TSource, TContext>, id?: 'api' | 'local'): void {
    Object.entries(query).forEach(
      ([key, value]) => {
        if (id === 'api' || !id) {
          this.options.api.queries[key] = value as GraphQLFieldConfig<unknown, unknown>
        }
        if (id === 'local' || !id) {
          this.options.local.queries[key] = value as GraphQLFieldConfig<unknown, unknown>
        }
      }
    )
    this.generateSchema()
  }

  removeQuery(queryName: string, id?: 'api' | 'local'): number {
    const count = id ? Number(this.removeById(queryName, id, 'queries')) : Number(this.removeById(queryName, 'api', 'queries')) + Number(this.removeById(queryName, 'local', 'queries'))
    this.generateSchema()
    return count
  }

  listMutations(): TQueriesList {
    return {
      api: Object.keys(this.apiSchema.mutations),
      local: Object.keys(this.localSchema.mutations),
    }
  }

  addOrUpdateMutation<TSource = unknown, TContext = unknown>(query: GraphQLFieldConfigMap<TSource, TContext>, id?: 'api' | 'local'): void {
    Object.entries(query).forEach(
      ([key, value]) => {
        if (id === 'api' || !id) {
          this.options.api.mutations[key] = value as GraphQLFieldConfig<unknown, unknown>
        }
        if (id === 'local' || !id) {
          this.options.local.mutations[key] = value as GraphQLFieldConfig<unknown, unknown>
        }
      }
    )
    this.generateSchema()
  }

  removeMutation(queryName: string, id?: 'api' | 'local'): number {
    const count = id ? Number(this.removeById(queryName, id, 'mutations')) : Number(this.removeById(queryName, 'api', 'mutations')) + Number(this.removeById(queryName, 'local', 'mutations'))
    this.generateSchema()
    return count
  }

  private removeById(queryName: string, id: 'api' | 'local', type: 'queries' | 'mutations'): boolean {
    return this.options[id][type][queryName] ? delete this.options[id][type][queryName]: false
  }

  private buildGraphQLSchema (
    options: TSchemaOptions<OptionsContext>
  ): SchemaObject {
    debug('Creating graphql schema')
    const targetSchema = options.isLocal ? 'local' : 'api'
    // lets define our root query
    const queries = {
      ...buildQueries<OptionsContext>(this, options),
      ...options[targetSchema].queries
    }
    const RootQuery = new GraphQLObjectType({
      name: 'Query',
      fields: queries,
    })
    
    const mutations = {
      ...buildMutations<OptionsContext>(this, options),
      ...options[targetSchema].mutations
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