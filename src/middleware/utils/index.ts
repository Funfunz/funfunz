import config from '../utils/configLoader'
import { IPropertyInfo, IEntityInfo } from '../../generator/configurationTypes'
import { GraphQLResolveInfo } from 'graphql'
import { parseResolveInfo, simplifyParsedResolveInfoFragmentWithType, ResolveTree } from 'graphql-parse-resolve-info'

/**
 * returns the table configuration based on the table name
 * @param {string} TABLE_NAME - the name of the table
 *
 * @returns {ITableInfo} table configuration
 */
export function getTableConfig(TABLE_NAME: string): IEntityInfo {
  return config().settings.filter(
    (tableItem) => tableItem.name === TABLE_NAME
  )[0]
}

/**
 * returns the columns configuration list transformed into an key:value object
 * where key equals to the column name, and value equals to the column configuration
 * @param {ITableInfo} TABLE_CONFIG - the table configuration
 *
 * @returns {{ [key: string]: IColumnInfo }} {[columnName]:[columnConfig]} object
 */
export function getColumnsByName(TABLE_CONFIG: IEntityInfo): Record<string, IPropertyInfo> {
  const columnsByName: Record<string, IPropertyInfo> = {}

  TABLE_CONFIG.properties.forEach(
    (column) => {
      columnsByName[column.name] = column
    }
  )

  return columnsByName
}

/**
 * returns the columns configuration list for the columns containing a relation
 * @param {ITableInfo} TABLE_CONFIG - the table configuration
 *
 * @returns {IColumnInfo[]} array of relation columns
 */
export function getColumnsWithRelations(TABLE_CONFIG: IEntityInfo): IPropertyInfo[] {
  return TABLE_CONFIG.properties.filter(
    (property) => property.relation
  )
}

/**
 * returns a list of primary keys for a give table configuration
 * @param {ITableInfo} TABLE_CONFIG - the table configuration
 *
 * @returns {string[]} array of primary keys
 */
export function getPKs(TABLE_CONFIG: IEntityInfo): string[] {
  return TABLE_CONFIG.properties.filter(
    (entity) => {
      return entity.model.isPk
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
  table: IEntityInfo,
  info: GraphQLResolveInfo
): string[] {
  const fields = [...(getPKs(table))]
  const parsedResolveInfoFragment = parseResolveInfo(info)
  if (parsedResolveInfoFragment) {
    const {fields: properties} = simplifyParsedResolveInfoFragmentWithType(
      parsedResolveInfoFragment as ResolveTree,
      info.returnType
    )
    Object.keys(properties).forEach(
      (propertyName) => {
        if (table.properties.find((c) => c.name === propertyName)) {
          fields.push(propertyName)
        }
        const relation = table.relations && table.relations.find((r) => {
          return r.remoteTable === propertyName && r.type === 'n:1'
        })
        if (relation) {
          fields.push(relation.foreignKey)
        }
      }
    )
  }
  return [...new Set(fields)]
}