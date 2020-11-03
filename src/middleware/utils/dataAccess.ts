import { Database } from '../db'
import { IUser } from '../types'
import { HttpException } from './exception'
import { ITableInfo } from '../../generator/configurationTypes'
import Knex from 'knex'

/**
 * checks for user authorization against a list of roles
 * of the list has the role "all" return always true
 * @param {string[]} roles - a list of roles
 * @param {IUser} user - the express session user
 *
 * @returns {boolean} true if authorized, false if not
 */
export function hasAuthorization(
  roles: string[],
  user: IUser = {
    roles: [
      {
        id: 0,
        name: 'unauthenticated',
      },
    ],
  }
): boolean {
  let isAuthorized = true
  if (roles && roles.length) {
    isAuthorized = !!roles.find(
      (role: string) => {
        if (role === 'all') {
          return true
        }
        return !!(user.roles?.find(
          (userRole) => {
            return (userRole.name === role)
          }
        ))
      }
    )
  }
  return isAuthorized
}

/**
 * checks for user authorization to the table based on the type of access requested
 * @param {ITableInfo} tableConfig - a table configuration
 * @param {'read' | 'write' | 'delete'} accessType - the type of access being requested
 * @param {IUser | undefined} user - the express session user of none for unauthenticated users
 * @param {Database} dbInstance - the database instance
 *
 * @returns {Promise<Knex>} the database connector
 */
export function requirementsCheck(
  tableConfig: ITableInfo,
  accessType: 'read' | 'create' | 'update' | 'delete',
  user: IUser | undefined,
  dbInstance: Database
): Promise<Knex<Record<string, unknown>, unknown[]>> {
  if (!hasAuthorization(tableConfig.roles[accessType], user)) {
    return Promise.reject(new HttpException(401, 'Not authorized'))
  }
  if (!dbInstance.db) {
    return Promise.reject(new HttpException(500, 'No database'))
  }
  return Promise.resolve(dbInstance.db)
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