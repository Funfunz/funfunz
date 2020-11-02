import { resolver } from './resolver'
import config from '../utils/configLoader'
import { IRelation, ITableInfo } from '../../generator/configurationTypes'
import Debug from 'debug'
import {
  GraphQLBoolean,
  GraphQLFieldConfigArgumentMap,
  GraphQLFieldConfigMap,
  GraphQLID,
  GraphQLInputFieldConfigMap,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLString,
} from 'graphql'
import { getPKs } from '../utils'
import { TUserContext } from './schema'

const debug = Debug('funfunz:graphql-type-builder')

interface IBuildTypeOptions {
  required?: ['pk' | string],
  include?: ['pk' | string],
  exclude?: ['pk' | string],
  relations?: boolean,
}

interface IBuildArgsOptions {
  required?: ['pk' | string],
  include?: ['pk' | string],
  exclude?: ['pk' | string],
  pagination?: boolean,
}

const MATCHER: {
  [key: string]: GraphQLScalarType
} = {
  'varchar(255)': GraphQLString,
  'int(11)': GraphQLInt,
  'int': GraphQLInt,
  'tinyint(1)': GraphQLBoolean,
  'datetime': GraphQLString,
}

const types: {
  [key: string]: GraphQLObjectType,
} = {}

export function buildFields<TSource>(
  table: ITableInfo,
  options: IBuildTypeOptions = {
    relations: true
  }
): GraphQLFieldConfigMap<TSource, TUserContext> {
  const { relations, required, include } = options
  const result: GraphQLFieldConfigMap<TSource, TUserContext> = {}
  
  const tablePKs = getPKs(table)
  const tableRelations = table.relations || []
  const relationalColumns = tableRelations.map((relation) => relation.foreignKey)
  table.columns.forEach((column) => {
    const isPk = tablePKs.indexOf(column.name) >= 0
    /*
     *  if include option is passed check if the column is present there
     */
    if (include && !include.includes(column.name) && !(isPk && include.includes('pk'))) {
      return
    }
    const isRequired = required && (
      required.includes(column.name) || (
        isPk && required.includes('pk')
      )
    )
    
    if (isPk || MATCHER[column.model.type]) {
      const type = isPk ? GraphQLID : MATCHER[column.model.type]
      result[column.name] = {
        type: isRequired ? new GraphQLNonNull(type) : type,
        description: column.layout.label as string,
      }
    }

    if (relationalColumns.includes(column.name)) {
      if (relations) {
        const relation = tableRelations.find((relation) => relation.foreignKey === column.name)
        if (!relation) {
          throw new Error('Invalid relation configuration: relation not found')
        }
        const remoteTable = relation.remoteTable
        const relatedTable = config().settings.find(
          (settingsTable) => settingsTable.name === remoteTable
        )
        if (!relatedTable) {
          throw new Error('Invalid relation configuration: relatedTable not found')
        }
        result[remoteTable] = {
          type: buildType(relatedTable),
          description: column.layout.label as string,
          resolve: resolver(relatedTable, table),
          args: buildArgs(relatedTable, { pagination: false }),
        }
        result[column.name] = {
          type: GraphQLID,
          description: column.layout.label as string,
        }
      } else {
        result[column.name] = {
          type: isRequired ? new GraphQLNonNull(GraphQLID) : GraphQLID,
          description: column.layout.label as string,
        }
      }
    }
  })
  if (tableRelations && relations) {
    const oneToMany = tableRelations.filter((r) => r.type === '1:n')
    if (oneToMany) {
      oneToMany.forEach((relation: IRelation) => {
        const remoteTable = relation.remoteTable
        const relatedTable = config().settings.find(
          (settingsTable) => (
            settingsTable.name === relation.remoteTable
          )
        )
        if (!relatedTable) {
          throw new Error('Invalid relation configuration: relatedTable not found')
        }
        result[remoteTable] = {
          type: new GraphQLList(buildType(relatedTable)),
          description: relatedTable.name,
          resolve: resolver(relatedTable, table),
          args: buildArgs(relatedTable, { pagination: true }),
        }
      })
    }
    const manyToMany = tableRelations.filter((r) => r.type === 'm:n')
    if (manyToMany) {
      manyToMany.forEach((relation) => {
        const columnName = relation.remoteTable
        const remoteTable = config().settings.find(
          (settingsTable) => settingsTable.name === relation.remoteTable
        )
        if (!remoteTable) {
          throw new Error('Invalid relation configuration: remoteTable not found')
        }
        result[columnName] = {
          type: new GraphQLList(buildType(remoteTable)),
          description: remoteTable.name,
          resolve: resolver(remoteTable, table),
          args: buildArgs(remoteTable, { pagination: true }),
        }
      })
    }
  }
  return result
}

const args: Record<string, GraphQLFieldConfigArgumentMap> = {} 

export function buildArgs(
  table: ITableInfo,
  options: IBuildArgsOptions = {
    pagination: true
  }
): GraphQLFieldConfigArgumentMap {
  if (args[table.name]) {
    return args[table.name]
  }
  const {required, include, pagination } = options
  args[table.name] = {}
  if (pagination) {
    args[table.name].take = {
      type: GraphQLInt,
      description: 'Take N items',
    }
    args[table.name].skip = {
      type: GraphQLInt,
      description: 'Skip N items',
    }
  }

  args[table.name].filter = {
    type: new GraphQLInputObjectType({
      name: `Filter${table.name}Data`,
      description: `Filter for the ${table.name} data`,
      fields: () => {
        const inputFields: GraphQLInputFieldConfigMap = {}
        const tablePKs = getPKs(table)
  
        table.columns.forEach(
          (column) => {
            const isPk = tablePKs.indexOf(column.name) >= 0
            /*
            *  if include option is passed check if the column is present there
            */
            if (include && !include.includes(column.name) && !(isPk && include.includes('pk'))) {
              return
            }

            /*
            *  Checks if the column name is present or if it's a primary key checks for the 'pk' key
            */
            const isRequired = required && (
              required.includes(column.name) || (
                isPk && required.includes('pk')
              )
            )
            
            const matchedType = MATCHER[column.model.type]

            if (isPk || matchedType) {
              const type = new GraphQLInputObjectType({
                name: `table${table.name}Field${column.name}`,
                description: `Filter for the field ${column.name}`,
                fields: () => argFilterBuilder(table, options, isPk, matchedType)
              })
              inputFields[column.name] = {
                type: isRequired ? new GraphQLNonNull(type) : type,
                description: column.layout.label,
              }
            }
          }
        )
        inputFields._and = {
          type: new GraphQLList(
            buildArgs(table, options).filter.type
          )
        }
        inputFields._or = {
          type: new GraphQLList(
            buildArgs(table, options).filter.type
          )
        }
        return inputFields
      },
    }),
    description: 'Query filter'
  }
  return args[table.name]
}

function argFilterBuilder(table: ITableInfo, options: IBuildArgsOptions, isPk: boolean, matchedType: GraphQLScalarType) {
  return {
    _eq: {
      type: isPk ? GraphQLID : matchedType
    },
    _like: {
      type: isPk ? GraphQLID : matchedType
    }
  }
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function buildType(table: ITableInfo, options: IBuildTypeOptions = { relations: true }): GraphQLObjectType {
  const name = table.name
  debug(`Creating type for table ${name}`)
  if (!types[name]) {
    types[name] = new GraphQLObjectType({
      name,
      fields: () => {
        return buildFields(table, options)
      },
    })
    debug(`Created type for table ${name}`)
  }
  return types[name]
}
export function buildDeleteMutationType(table: ITableInfo): GraphQLObjectType<unknown, unknown> {
  const name = `delete${capitalize(table.name)}`
  debug(`Creating ${name}`)
  if (!types[name]) {
    types[name] = new GraphQLObjectType({
      name,
      fields: () => ({
        success: {
          type: GraphQLBoolean,
        },
      }),
    })
    debug(`Created ${name}`)
  }
  return types[name]
}
