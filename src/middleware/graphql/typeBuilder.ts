import { resolver } from './resolver'
import config from '../utils/configLoader'
import { IRelation, IEntityInfo } from '../../generator/configurationTypes'
import Debug from 'debug'
import {
  GraphQLFieldConfigMap,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'
import { capitalize, getPKs } from '../utils/index'
import { buildArgs } from './argumentsBuilder'
import { MATCHER } from './helpers'
import type { SchemaManager, TSchemaOptions } from './manager'
import { GraphQLUpload } from 'graphql-upload'

const debug = Debug('funfunz:graphql-type-builder')

interface IBuildTypeOptions {
  required?: ['pk' | string],
  include?: ['pk' | string],
  exclude?: ['pk' | string],
  relations?: boolean,
}

const entitiesType: Record<string, GraphQLObjectType> = {}

function buildQueryFileType(name) {
  return {
    type: new GraphQLObjectType({
      name: 'File',
      fields: {
        url: {
          type: GraphQLString,
          description: 'Download url',
        },
        content: {
          type: GraphQLString,
          description: 'File content',
        },
        type: {
          type: GraphQLString,
          description: 'MIME type'
        }
      }
    }),
    description: name,
  }
}

export function buildFields<TSource>(
  entity: IEntityInfo,
  schemaManager: SchemaManager<unknown>,
  schemaOptions: TSchemaOptions<unknown>,
  options: IBuildTypeOptions = {
    relations: true
  }
): GraphQLFieldConfigMap<TSource, unknown> {
  const { relations, required, include } = options
  const result: GraphQLFieldConfigMap<TSource, unknown> = {}
  
  const entityPKs = getPKs(entity)
  const entityRelations = entity.relations || []
  const relationalColumns = entityRelations.map((relation) => relation.foreignKey)
  entity.properties.forEach((column) => {
    const isPk = entityPKs.indexOf(column.name) >= 0
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
    
    if (MATCHER[column.type]) {
      const type = MATCHER[column.type]
      result[column.name] = type === GraphQLUpload
        ? buildQueryFileType(column.name)
        : {
          type: isRequired ? new GraphQLNonNull(type) : type,
          description: column.name,
        }
      
    }

    if (relationalColumns.includes(column.name)) {
      if (relations) {
        const relation = entityRelations.find((relation) => relation.foreignKey === column.name)
        if (!relation) {
          throw new Error('Invalid relation configuration: relation not found')
        }
        const remoteEntity = relation.remoteEntity
        const relatedEntity = config().settings.find(
          (settingsEntity) => settingsEntity.name === remoteEntity
        )
        if (!relatedEntity) {
          throw new Error(`Invalid relation configuration: remoteEntity "${remoteEntity}" not found on relation ${relation.foreignKey} on entity ${entity.name}`)
        }
        result[remoteEntity] = {
          type: buildType(relatedEntity, schemaManager, schemaOptions),
          description: column.name,
          resolve: resolver(relatedEntity, schemaManager, schemaOptions,  entity, relation.type),
          args: buildArgs(relatedEntity, { pagination: false, filter: true }),
        }
        result[column.name] = {
          type: MATCHER[column.type],
          description: column.name,
        }
      } else {
        result[column.name] = {
          type: isRequired ? new GraphQLNonNull(MATCHER[column.type]) : MATCHER[column.type],
          description: column.name,
        }
      }
    }
  })
  if (entityRelations && relations) {
    const oneToMany = entityRelations.filter((r) => r.type === '1:n')
    if (oneToMany) {
      oneToMany.forEach((relation: IRelation) => {
        const remoteEntity = relation.remoteEntity
        const relatedEntity = config().settings.find(
          (settingsEntity) => (
            settingsEntity.name === relation.remoteEntity
          )
        )
        if (!relatedEntity) {
          throw new Error('Invalid relation configuration: relatedEntity not found')
        }
        result[remoteEntity] = {
          type: new GraphQLList(buildType(relatedEntity, schemaManager, schemaOptions)),
          description: relatedEntity.name,
          resolve: resolver(relatedEntity, schemaManager, schemaOptions, entity),
          args: buildArgs(relatedEntity, { pagination: true, filter: true }),
        }
      })
    }
    const manyToMany = entityRelations.filter((r) => r.type === 'm:n')
    if (manyToMany) {
      manyToMany.forEach((relation) => {
        const columnName = relation.remoteEntity
        const remoteEntity = config().settings.find(
          (settingsEntity) => settingsEntity.name === relation.remoteEntity
        )
        if (!remoteEntity) {
          throw new Error('Invalid relation configuration: remoteEntity not found')
        }
        result[columnName] = {
          type: new GraphQLList(buildType(remoteEntity, schemaManager, schemaOptions)),
          description: remoteEntity.name,
          resolve: resolver(remoteEntity, schemaManager, schemaOptions, entity),
          args: buildArgs(remoteEntity, { pagination: true, filter: true }),
        }
      })
    }
  }
  return result
}

export function buildType(
  entity: IEntityInfo,
  schemaManager: SchemaManager<unknown>,
  schemaOptions: TSchemaOptions<unknown>,
  options: IBuildTypeOptions = { relations: true }
): GraphQLObjectType {
  const name = entity.name
  debug(`Creating type for entity ${name}`)
  if (!entitiesType[name]) {
    entitiesType[name] = new GraphQLObjectType({
      name,
      fields: () => {
        return buildFields(entity, schemaManager, schemaOptions, options)
      },
    })
    debug(`Created type for entity ${name}`)
  }
  return entitiesType[name]
}
export function buildDeleteMutationType(entity: IEntityInfo): GraphQLObjectType<unknown, unknown> {
  const name = `delete${capitalize(entity.name)}`
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
