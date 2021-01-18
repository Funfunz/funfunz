import { resolver } from './resolver'
import config from '../utils/configLoader'
import { IRelation, IEntityInfo } from '../../generator/configurationTypes'
import Debug from 'debug'
import {
  GraphQLFieldConfigMap,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql'
import { capitalize, getPKs } from '../utils/index'
import { buildArgs } from './argumentsBuilder'
import { MATCHER } from './helpers'
import type { SchemaManager, TSchemaOptions } from './manager'

const debug = Debug('funfunz:graphql-type-builder')

interface IBuildTypeOptions {
  required?: ['pk' | string],
  include?: ['pk' | string],
  exclude?: ['pk' | string],
  relations?: boolean,
}

const entitiesType: Record<string, GraphQLObjectType> = {}

export function buildFields<TSource>(
  table: IEntityInfo,
  schemaManager: SchemaManager<unknown>,
  schemaOptions: TSchemaOptions<unknown>,
  options: IBuildTypeOptions = {
    relations: true
  }
): GraphQLFieldConfigMap<TSource, unknown> {
  const { relations, required, include } = options
  const result: GraphQLFieldConfigMap<TSource, unknown> = {}
  
  const tablePKs = getPKs(table)
  const tableRelations = table.relations || []
  const relationalColumns = tableRelations.map((relation) => relation.foreignKey)
  table.properties.forEach((column) => {
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
        description: column.layout?.label as string || column.name,
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
          (settingsEntity) => settingsEntity.name === remoteTable
        )
        if (!relatedTable) {
          throw new Error('Invalid relation configuration: relatedTable not found')
        }
        result[remoteTable] = {
          type: buildType(relatedTable, schemaManager, schemaOptions),
          description: column.layout?.label as string || column.name,
          resolve: resolver(relatedTable, schemaManager, schemaOptions,  table, relation.type),
          args: buildArgs(relatedTable, { pagination: false, filter: true }),
        }
        result[column.name] = {
          type: GraphQLID,
          description: column.layout?.label as string || column.name,
        }
      } else {
        result[column.name] = {
          type: isRequired ? new GraphQLNonNull(GraphQLID) : GraphQLID,
          description: column.layout?.label as string || column.name,
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
          type: new GraphQLList(buildType(relatedTable, schemaManager, schemaOptions)),
          description: relatedTable.name,
          resolve: resolver(relatedTable, schemaManager, schemaOptions, table),
          args: buildArgs(relatedTable, { pagination: true, filter: true }),
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
          type: new GraphQLList(buildType(remoteTable, schemaManager, schemaOptions)),
          description: remoteTable.name,
          resolve: resolver(remoteTable, schemaManager, schemaOptions, table),
          args: buildArgs(remoteTable, { pagination: true, filter: true }),
        }
      })
    }
  }
  return result
}

export function buildType(
  table: IEntityInfo,
  schemaManager: SchemaManager<unknown>,
  schemaOptions: TSchemaOptions<unknown>,
  options: IBuildTypeOptions = { relations: true }
): GraphQLObjectType {
  const name = table.name
  debug(`Creating type for table ${name}`)
  if (!entitiesType[name]) {
    entitiesType[name] = new GraphQLObjectType({
      name,
      fields: () => {
        return buildFields(table, schemaManager, schemaOptions, options)
      },
    })
    debug(`Created type for table ${name}`)
  }
  return entitiesType[name]
}
export function buildDeleteMutationType(table: IEntityInfo): GraphQLObjectType<unknown, unknown> {
  const name = `delete${capitalize(table.name)}`
  debug(`Creating ${name}`)
  if (!entitiesType[name]) {
    entitiesType[name] = new GraphQLObjectType({
      name,
      fields: () => ({
        deleted: {
          type: GraphQLInt,
        },
      }),
    })
    debug(`Created ${name}`)
  }
  return entitiesType[name]
}
