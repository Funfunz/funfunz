import { operators, OperatorsType } from '../utils/filter'
import { IEntityInfo } from '../../generator/configurationTypes'
import Debug from 'debug'
import {
  GraphQLArgumentConfig,
  GraphQLFieldConfigArgumentMap,
  GraphQLInputFieldConfigMap,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLScalarType,
} from 'graphql'
import { getPKs } from '../utils/index'
import { MATCHER } from './helpers'

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
  table: IEntityInfo,
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
          name: filterId,
          description: `Filter for the ${table.name} data`,
          fields: () => {
            const inputFields: GraphQLInputFieldConfigMap = {}
            const tablePKs = getPKs(table)
      
            table.properties.forEach(
              (property) => {
                if (property.filterable === false) {
                  return
                }
                const isPk = tablePKs.indexOf(property.name) >= 0
                /*
                *  if include option is passed check if the column is present there
                */
                if (include && !include.includes(property.name) && !(isPk && include.includes('pk'))) {
                  return
                }
    
                /*
                *  Checks if the column name is present or if it's a primary key checks for the 'pk' key
                */
                const isRequired = required && (
                  required.includes(property.name) || (
                    isPk && required.includes('pk')
                  )
                )
                
                const matchedType = MATCHER[property.model.type]
    
                const supportedOperators = (property.filterable === true || property.filterable === undefined)
                  ? operators
                  : property.filterable.filters
                if (matchedType) {
                  const type = new GraphQLInputObjectType({
                    name: `table${table.name}Field${property.name}`,
                    description: `Filter for the field ${property.name}`,
                    fields: () => argFieldBuilder(matchedType, supportedOperators)
                  })
                  inputFields[property.name] = {
                    type: isRequired ? new GraphQLNonNull(type) : type,
                    description: property.layout?.label || property.name,
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
      
            table.properties.forEach(
              (property) => {
                const isPk = tablePKs.indexOf(property.name) >= 0
                /*
                *  if include option is passed check if the column is present there
                */
                if (include && !include.includes(property.name) && !(isPk && include.includes('pk'))) {
                  return
                }
    
                /*
                *  Checks if the column name is present or if it's a primary key checks for the 'pk' key
                */
                const isRequired = required && (
                  required.includes(property.name) || (
                    isPk && required.includes('pk')
                  )
                )
                
                const matchedType = MATCHER[property.model.type]
    
                if (isPk || matchedType) {
                  const type = matchedType
                  inputFields[property.name] = {
                    type: isRequired ? new GraphQLNonNull(type) : type,
                    description: property.layout?.label || property.name,
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


export function argFieldBuilder(matchedType: GraphQLScalarType, supportedOperators: OperatorsType[]): GraphQLInputFieldConfigMap {
  const argFilter = {}
  supportedOperators.forEach(
    operator => {
      if (operator === '_in' || operator === '_nin') {
        argFilter[operator] = {
          type: GraphQLList(matchedType)
        }
      } else {
        argFilter[operator] = {
          type: matchedType
        }
      }
      
    }
  )
  return argFilter
}
