import { resolver } from './resolver'
import config from '../utils/configLoader'
import { IRelation, IRelationMN, ITableInfo } from '../../generator/configurationTypes'
import Debug from 'debug'
import {
  GraphQLBoolean,
  GraphQLFieldConfigArgumentMap,
  GraphQLFieldConfigMap,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLString,
  Thunk,
} from 'graphql'
import { getPKs } from '../utils'
import { TUserContext } from './queries'

const debug = Debug('funfunz:graphql-type-builder')

interface IBuildTypeOptions {
  required?: ['pk' | string],
  include?: ['pk' | string],
  exclude?: ['pk' | string],
  relations?: boolean,
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

export function buildFields(
  table: ITableInfo,
  options: IBuildTypeOptions = {
    relations: true,
    pagination: true
  }
): GraphQLFieldConfigArgumentMap {
  const { relations, required, include, pagination } = options
  const result: GraphQLFieldConfigArgumentMap = {}
  if (pagination) {
    result.limit = {
      type: GraphQLInt,
      description: 'Limit',
    }
    result.offset = {
      type: GraphQLInt,
      description: 'Offset',
    }
  }
  table.columns.forEach((column) => {
    const isPk = getPKs(table).indexOf(column.name) >= 0
    if (include && !include.includes(column.name) && !(isPk ? include.includes('pk') : false)) {
      return
    }
    const isRequired = required && (
      isPk
        ? required.includes('pk')
        : required.includes(column.name)
    )
    const relationalColumns = (table.relations && table.relations.map((relation) => relation.foreignKey)) || []
    if (getPKs(table).indexOf(column.name) >= 0 || MATCHER[column.model.type]) {
      const type = isPk ? GraphQLID : MATCHER[column.model.type]
      result[column.name] = {
        type: isRequired ? new GraphQLNonNull(type) : type,
        description: column.layout.label,
      }
    }

    if (relationalColumns.includes(column.name)) {
      if (relations) {
        const relation = table.relations && table.relations.find((r) => r.foreignKey === column.name)
        if (!relation) {
          throw new Error('Invalid relation configuration')
        }
        const columnName = (relation.type === 'n:1' || relation.type === 'm:n')
          ? relation.remoteTable
          : column.name
        const relatedTable = config().settings.filter(
          (settingsTable) => settingsTable.name === relation.remoteTable
        )[0]
        result[columnName] = {
          type: buildType(relatedTable),
          description: column.layout.label,
          resolve: resolver(relatedTable, table),
          args: buildFields(relatedTable, { relations: false, pagination: false }),
        }
        if (column.name !== columnName) {
          result[column.name] = {
            type: GraphQLID,
            description: column.layout.label,
          }
        }
      } else {
        result[column.name] = {
          type: isRequired ? new GraphQLNonNull(GraphQLID) : GraphQLID,
          description: column.layout.label,
        }
      }
    }
  })
  if (table.relations && relations) {
    const oneToMany = table.relations && table.relations.filter((r) => r.type === '1:n')
    if (oneToMany) {
      oneToMany.forEach((relation: IRelation) => {
        const columnName = relation.remoteTable
        const relationTable = config().settings.filter((settingsTable) => {
          if ((relation as IRelationMN).relationalTable) {
            return settingsTable.name === (relation as IRelationMN).relationalTable
          }
          return settingsTable.name === relation.remoteTable
        })[0]
        result[columnName] = {
          type: new GraphQLList(buildType(relationTable)),
          description: relationTable.name,
          resolve: resolver(relationTable, table),
          args: buildFields(relationTable, { relations: false, pagination: true }),
        }
      })
    }
    const manyToMany = table.relations && table.relations.filter((r) => r.type === 'm:n')
    if (manyToMany) {
      manyToMany.forEach((relation) => {
        const columnName = relation.remoteTable
        const remoteTable = config().settings.filter(
          (settingsTable) => settingsTable.name === relation.remoteTable
        )[0]
        result[columnName] = {
          type: new GraphQLList(buildType(remoteTable)),
          description: remoteTable.name,
          resolve: resolver(remoteTable, table),
          args: buildFields(remoteTable, { relations: false, pagination: true }),
        }
      })
    }
  }
  return result
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function buildType(table: ITableInfo, options: IBuildTypeOptions = { relations: true }): GraphQLObjectType {
  const name = table.name
  debug(`Creating ${name}`)
  if (!types[name]) {
    types[name] = new GraphQLObjectType({
      name,
      fields: () => {
        return buildFields(table, options)
      },
    })
    debug(`Created ${name}`)
  }
  return types[name]
}
export function buildDeleteMutationType(table: ITableInfo) {
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
