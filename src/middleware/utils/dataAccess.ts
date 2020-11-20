import { IUser } from '../types'
import { HttpException } from './exception'
import { IEntityInfo } from '../../generator/configurationTypes'

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
  },
  superUser?: boolean
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
            return superUser || (userRole.name === role)
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
 * @returns {Promise<boolean>} the database connector
 */
export function requirementsCheck(
  tableConfig: IEntityInfo,
  accessType: 'read' | 'create' | 'update' | 'delete',
  user: IUser | undefined,
  superUser?: boolean
): Promise<boolean> {
  if (!hasAuthorization(tableConfig.roles[accessType], user, superUser)) {
    return Promise.reject(new HttpException(401, 'Not authorized'))
  }
  return Promise.resolve(true)
}
