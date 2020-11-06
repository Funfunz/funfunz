import { ITableInfo } from '../../generator/configurationTypes'
import Debug from 'debug'
import {
  GraphQLFieldConfigArgumentMap,
  GraphQLID,
  GraphQLInputFieldConfigMap,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLScalarType,
} from 'graphql'
import { getPKs } from '../utils/index'
import { MATCHER } from './helpers'
import { operators } from '../utils/filter'

const debug = Debug('funfunz:graphql-args-builder')

interface IBuildArgsOptions {
  required?: ['pk' | string],
  include?: ['pk' | string],
  exclude?: ['pk' | string],
  pagination?: boolean,
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
  debug(`Creating args for table ${table.name}`)
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
                fields: () => argFilterBuilder(isPk, matchedType)
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
  debug(`Created args for table ${table.name}`)
  return args[table.name]
}

function argFilterBuilder(isPk: boolean, matchedType: GraphQLScalarType) {
  const argFilter = {}
  operators.forEach(
    operator => {
      argFilter[operator] = {
        type: isPk ? GraphQLID : matchedType
      }
    }
  )
  return argFilter
}
