import { IProperty, IEntityInfo } from '../../generator/configurationTypes'
import { GraphQLResolveInfo } from 'graphql'
import { parseResolveInfo, simplifyParsedResolveInfoFragmentWithType, ResolveTree } from 'graphql-parse-resolve-info'
import { IFunfunzConfig } from '../types'

/**
 * returns the entity configuration based on the entity name
 * @param {string} ENTITY_NAME - the name of the entity
 *
 * @returns {IEntityInfo} entity configuration
 */
export function getEntityConfig(ENTITY_NAME: string, funfunz: IFunfunzConfig): IEntityInfo {
  return funfunz.settings.filter(
    (entityItem) => entityItem.name === ENTITY_NAME
  )[0]
}

/**
 * returns the columns configuration list transformed into an key:value object
 * where key equals to the column name, and value equals to the column configuration
 * @param {IEntityInfo} ENTITY_CONFIG - the entity configuration
 *
 * @returns {{ [key: string]: IColumnInfo }} {[columnName]:[columnConfig]} object
 */
export function getColumnsByName(ENTITY_CONFIG: IEntityInfo): Record<string, IProperty> {
  const columnsByName: Record<string, IProperty> = {}

  ENTITY_CONFIG.properties.forEach(
    (column) => {
      columnsByName[column.name] = column
    }
  )

  return columnsByName
}

/**
 * returns a list of primary keys for a give entity configuration
 * @param {IEntityInfo} ENTITY_CONFIG - the entity configuration
 *
 * @returns {string[]} array of primary keys
 */
export function getPKs(ENTITY_CONFIG: IEntityInfo): string[] {
  return ENTITY_CONFIG.properties.filter(
    (property) => {
      return property.isPk
    }
  ).map(
    (property) => {
      return property.name
    }
  )
}

/**
 * helper function to check for undefined, null, and empty values
 * @param {any} val - a variable
 *
 * @returns {boolean} true or false if val is a nullable value
 */
export function isNull(val: unknown): boolean {
  return val === '' || val === undefined || val === null
}

/**
 * helper function to check value is a promise
 * @param {any} val - a variable
 *
 * @returns {boolean} true or false if val is a nullable value
 */

export function isPromise<T>(value: unknown): value is Promise<T> {
  return typeof (value as Promise<unknown>)?.then === 'function'
}


/**
 * Uppercase the first letter of a string
 * @param {string} str - string to capitalize
 *
 * @returns {string} capitalized string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function getFields(
  entity: IEntityInfo,
  info: GraphQLResolveInfo
): string[] {
  const fields = [...(getPKs(entity))]
  const parsedResolveInfoFragment = parseResolveInfo(info)
  if (parsedResolveInfoFragment) {
    const {fields: properties} = simplifyParsedResolveInfoFragmentWithType(
      parsedResolveInfoFragment as ResolveTree,
      info.returnType
    )
    Object.keys(properties).forEach(
      (propertyName) => {
        if (entity.properties.find((c) => c.name === propertyName)) {
          fields.push(propertyName)
        }
        const relation = entity.relations && entity.relations.find((r) => {
          return r.remoteEntity === propertyName && r.type === 'n:1'
        })
        if (relation) {
          fields.push(relation.foreignKey)
        }
      }
    )
  }
  return [...new Set(fields)]
}