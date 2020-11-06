import { ITableInfo } from '../../generator/configurationTypes'
import Debug from 'debug'
import {
  GraphQLArgumentConfig,
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
  data?: boolean,
  filter?: boolean,
  pagination?: boolean,
}

const args: Record<string, GraphQLFieldConfigArgumentMap> = {} 
const dataInputs: Record<string, GraphQLArgumentConfig> = {}
const filters: Record<string, GraphQLArgumentConfig> = {}

export function buildArgs(
  table: ITableInfo,
  options: IBuildArgsOptions
): GraphQLFieldConfigArgumentMap {
  const tableId = `${table.name}-${JSON.stringify(options)}`
  if (args[tableId]) {
    return args[tableId]
  }
  args[tableId] = {}
  debug(`Creating args for table ${table.name}`)
  const {required, include, pagination, filter, data } = options
  if (pagination) {
    args[tableId].take = {
      type: GraphQLInt,
      description: 'Take N items',
    }
    args[tableId].skip = {
      type: GraphQLInt,
      description: 'Skip N items',
    }
  }

  if (filter) {
    const filterId = `filter${table.name}Data`
    if (filters[filterId]) {
      args[tableId].filter = filters[filterId]
    } else {
      args[tableId].filter = filters[filterId] = {
        type: new GraphQLInputObjectType({
          name: `filter${table.name}Data`,
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
                    name: `mutationTable${table.name}Field${column.name}`,
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
    }
  }

  if (data) {
    const dataInputId = `input${table.name}Data`
    if (dataInputs[dataInputId]) {
      args[tableId].data = dataInputs[dataInputId]
    } else {
      args[tableId].data = dataInputs[dataInputId] = {
        type: new GraphQLInputObjectType({
          name: `input${table.name}Data`,
          description: `Data to update ${table.name}`,
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
                  const type = isPk ? GraphQLID : matchedType
                  inputFields[column.name] = {
                    type: isRequired ? new GraphQLNonNull(type) : type,
                    description: column.layout.label,
                  }
                }
              }
            )
            return inputFields
          },
        }),
        description: 'Query filter'
      }
    }
  }
  
  debug(`Created args for table ${table.name}`)
  return args[tableId]
}

function argFilterBuilder(isPk: boolean, matchedType: GraphQLScalarType) {
  const argFilter = {}
  operators.forEach(
    operator => {
      if (operator === '_in' || operator === '_nin') {
        argFilter[operator] = {
          type: isPk ? GraphQLList(GraphQLID) : GraphQLList(matchedType)
        }
      } else {
        argFilter[operator] = {
          type: isPk ? GraphQLID : matchedType
        }
      }
      
    }
  )
  return argFilter
}
