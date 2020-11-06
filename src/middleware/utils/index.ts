import config from '../utils/configLoader'
import { IColumnInfo, ITableInfo } from '../../generator/configurationTypes'

/**
 * returns the table configuration based on the table name
 * @param {string} TABLE_NAME - the name of the table
 *
 * @returns {ITableInfo} table configuration
 */
export function getTableConfig(TABLE_NAME: string): ITableInfo {
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
export function getColumnsByName(TABLE_CONFIG: ITableInfo): Record<string, IColumnInfo> {
  const columnsByName: Record<string, IColumnInfo> = {}

  TABLE_CONFIG.columns.forEach(
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
export function getColumnsWithRelations(TABLE_CONFIG: ITableInfo): IColumnInfo[] {
  return TABLE_CONFIG.columns.filter(
    (column) => column.relation
  )
}

/**
 * returns a list of primary keys for a give table configuration
 * @param {ITableInfo} TABLE_CONFIG - the table configuration
 *
 * @returns {string[]} array of primary keys
 */
export function getPKs(TABLE_CONFIG: ITableInfo): string[] {
  return TABLE_CONFIG.columns.filter((column) => {
    return column.model.isPk
  }).map((column) => {
    return column.name
  })
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return typeof (value as any)?.then === 'function'
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