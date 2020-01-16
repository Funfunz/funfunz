import database from '@root/api/db'
import { HttpException, IMCRequest, IMCResponse } from '@root/api/types'
import {
  addToResponse,
  applyPKFilters,
  applyQueryFiltersSearch,
  catchMiddleware,
  filterVisibleTableColumns,
  getTableConfig,
  hasAuthorization,
  nextAndReturn,
  requirementsCheck,
  runHook,
} from '@root/api/utils'
import { normalize as normalizeData } from '@root/api/utils/data'
import {
  addVerboseRelatedData,
  getRelatedData,
} from '@root/api/utils/relations'
import Debug from 'debug'
import { NextFunction } from 'express'
import Knex from 'knex'
import metle from 'metle'

const debug = Debug('funfunzmc:controller-table')

class TableController {
  constructor() {
    debug('Created')
  }

  /**
   * Adds to response.data the configuration of the requested table
   * @get params:
   *  - {String} table: table name
   * @param {Object} request
   * @param {Object} response
   * @param {Object} next
   * @res.data {Object} requested table configuration
   */
  public getTableConfig(req: IMCRequest, res: IMCResponse, next: NextFunction) {
    const TABLE_CONFIG = getTableConfig(req.params.table)

    if (!hasAuthorization(TABLE_CONFIG.roles.read, req.user)) {
      return catchMiddleware(next, new HttpException(401, 'Not authorized'))
    }
    addToResponse(res, 'results')(TABLE_CONFIG)
    return nextAndReturn(next)(TABLE_CONFIG)
  }

  /**
   * Adds to response.data all rows that match the requested filter
   * @get params:
   *  - {String} table: table name
   *  - {Object | Array} order: object of array of objects containing the order field and asc|desc
   *  - {Object} filter: object where key is the column name and value is the search match
   *  - {String} search: string that will be matched against the search fields in the configuration
   *  - {Number} page: requested page for pagination
   *  - {Number} limit: requested quantity of items for pagination
   *  - {Boolen} includeRelations: adds related data 1 level deep
   *  - {Boolen} friendlyData: replaces relation id's with friendly values based on configuration
   * @param {Object} request
   * @param {Object} response
   * @param {Object} next
   * @res.data {Object} requested table configuration
   */
  public getTableData(req: IMCRequest, res: IMCResponse, next: NextFunction) {
    const TABLE_NAME = req.params.table
    const ORDER = req.query.order || null
    const TABLE_CONFIG = getTableConfig(TABLE_NAME)
    const COLUMNS = filterVisibleTableColumns(TABLE_CONFIG, 'list')

    return requirementsCheck(TABLE_CONFIG, 'read', req.user, database).then(
      (DB) => {
        return Promise.all([
          DB,
          runHook(TABLE_CONFIG, 'getTableData', 'before', req, res, DB),
        ])
      }
    ).then(
      ([DB, hookResult]) => {
        let QUERY = DB.select(COLUMNS).from(TABLE_NAME)
        QUERY = applyQueryFiltersSearch(QUERY, req.query, TABLE_CONFIG)

        if (ORDER) {
          const ORDER_OBJ = JSON.parse(ORDER)
          if (Array.isArray(ORDER_OBJ)) {
            QUERY.orderBy(ORDER_OBJ)
          } else {
            QUERY.orderBy(ORDER_OBJ.column, ORDER_OBJ.order)
          }
        }

        QUERY = this.paginate(QUERY, req.query.page , req.query.limit)

        if (hookResult) {
          if (hookResult.filter) {
            Object.keys(hookResult.filter).forEach(
              (column) => {
                if (Array.isArray(hookResult.filter[column])) {
                  QUERY.whereIn(column, hookResult.filter[column])
                }
              }
            )
          }
        }
        return Promise.all([
          QUERY,
          DB,
        ])
      }
    ).then(
      ([results, DB]) => {
        if (req.query.includeRelations) {
          results.forEach(
            (result: any, index: number) => {
              results[index] = getRelatedData(TABLE_CONFIG, result)
            }
          )
          return Promise.all([
            Promise.all(results),
            DB,
          ])
        }
        return Promise.all([
          results,
          DB,
        ])
      }
    ).then(
      ([results, DB]) => {
        if (req.query.friendlyData) {
          return Promise.all([
            addVerboseRelatedData(results, TABLE_CONFIG, DB),
            DB,
          ])
        }
        return Promise.all([
          results,
          DB,
        ])
      }
    ).then(
      ([results, DB]) => {
        return runHook(TABLE_CONFIG, 'getTableData', 'after', req, res, DB, results)
      }
    ).then(
      addToResponse(res, 'results')
    ).then(
      nextAndReturn(next)
    ).catch(
      (err) => {
        catchMiddleware(next, err)
      }
    )
  }

  /**
   * Adds to response.data all distinct rows that match the requested filter
   * @get params:
   *  - {String} table: table name
   *  - {Object} filter: object where key is the column name and value is the search match
   *  - {String} search: string that will be matched against the search fields in the configuration
   *  - {Array<String>} columns: desired columns to use in the distinct query
   * @param {Object} request
   * @param {Object} response
   * @param {Object} next
   * @res.data {Object} requested table configuration
   */
  public getDistinctTableData(req: IMCRequest, res: IMCResponse, next: NextFunction) {
    const TABLE_NAME = req.params.table
    const TABLE_CONFIG = getTableConfig(TABLE_NAME)

    return requirementsCheck(TABLE_CONFIG, 'read', req.user, database).then(
      (DB) => {
        const columns: {
          toRequest: string[],
          toAdd: Array<{
            name: string,
            value: string[],
          }>
        } = {
          toRequest: [],
          toAdd: [],
        }
        req.query.columns.forEach(
          (column: string) => {
            if (metle.hasItem('distinct_' + column)) {
              columns.toAdd.push({
                name: column,
                value: metle.getItem('distinct_' + column),
              })
            } else {
              columns.toRequest.push(column)
            }
          }
        )
        let QUERY = DB(TABLE_NAME).distinct(columns.toRequest)
        QUERY = applyQueryFiltersSearch(QUERY, req.query, TABLE_CONFIG)
        return runHook(TABLE_CONFIG, 'getDistinctTableData', 'before', req, res, DB).then(
          (hookResult) => {
            if (hookResult) {
              if (hookResult.filter) {
                Object.keys(hookResult.filter).forEach(
                  (column) => {
                    if (Array.isArray(hookResult.filter[column])) {
                      QUERY.whereIn(column, hookResult.filter[column])
                    }
                  }
                )
              }
            }
            return Promise.all([DB, QUERY, columns.toAdd])
          }
        )
      }
    ).then(
      ([DB, queryResults, columnsToAdd]) => {
        const results = queryResults.reduce(
          (result, entry) => {
            const key = Object.keys(entry)[0]
            if (!result[key]) {
              result[key] = []
            }
            result[key].push(entry[key])
            return result
          },
          {}
        )

        Object.keys(results).forEach(
          (column: string) => {
            metle.setItem('distinct_' + column, results[column])
          }
        )

        columnsToAdd.forEach(
          (column) => {
            results[column.name] = column.value
          }
        )
        return runHook(TABLE_CONFIG, 'getDistinctTableData', 'after', req, res, DB, results)
      }
    ).then(
      addToResponse(res, 'results')
    ).then(
      nextAndReturn(next)
    ).catch(
      (err) => {
        catchMiddleware(next, new HttpException(500, err.message))
      }
    )
  }

  public getTableCount(req: IMCRequest, res: IMCResponse, next: NextFunction) {
    const TABLE_NAME = req.params.table
    const TABLE_CONFIG = getTableConfig(TABLE_NAME)

    return requirementsCheck(TABLE_CONFIG, 'read', req.user, database).then(
      (DB) => {
        let QUERY = DB(TABLE_NAME).select('*')
        QUERY = applyQueryFiltersSearch(QUERY, req.query, TABLE_CONFIG)
        return Promise.all([DB, QUERY])
      }
    ).then(
      ([DB, results]) => {
        return runHook(TABLE_CONFIG, 'getTableCount', 'after', req, res, DB, results)
      }
    ).then(
      addToResponse(res, 'count')
    ).then(
      nextAndReturn(next)
    ).catch(
      (err) => {
        catchMiddleware(next, err)
      }
    )
  }

  public getRowData(req: IMCRequest, res: IMCResponse, next: NextFunction) {
    const TABLE_NAME = req.params.table
    const TABLE_CONFIG = getTableConfig(TABLE_NAME)

    return requirementsCheck(TABLE_CONFIG, 'read', req.user, database).then(
      (DB) => {
        const requestedColumns = filterVisibleTableColumns(TABLE_CONFIG, 'list')
        let QUERY = DB.select(requestedColumns).from(`${req.params.table}`)
        QUERY = applyPKFilters(QUERY, req.body, TABLE_CONFIG)
        return QUERY
      }
    ).then(
      (results) => {
        const result = results[0]
        if (req.query.includeRelations) {
          return getRelatedData(TABLE_CONFIG, result)
        }
        return result
      }
    ).then(
      (results) => {
        return runHook(TABLE_CONFIG, 'getRow', 'after', req, res, database.db, results)
      }
    ).then(
      addToResponse(res, 'results')
    ).then(
      nextAndReturn(next)
    ).catch(
      (err) => {
        catchMiddleware(next, err)
      }
    )
  }

  public insertRowData(req: IMCRequest, res: IMCResponse, next: NextFunction) {
    const TABLE_NAME = req.params.table
    const TABLE_CONFIG = getTableConfig(TABLE_NAME)
    return requirementsCheck(TABLE_CONFIG, 'create', req.user, database).then(
      (DB) => {
        const data = normalizeData(req.body.data, TABLE_CONFIG)
        return Promise.all([
          DB,
          runHook(TABLE_CONFIG, 'insertRow', 'before', req, res, DB, data),
        ])
      }
    ).then(
      ([DB, data]) => {
        return DB(req.params.table).insert(data)
      }
    ).then(
      (results) => {
        return runHook(TABLE_CONFIG, 'insertRow', 'after', req, res, database.db, results)
      }
    ).then(
      addToResponse(res, 'results')
    ).then(
      nextAndReturn(next)
    ).catch(
      (err) => {
        catchMiddleware(next, err)
      }
    )
  }

  public updateRowData(req: IMCRequest, res: IMCResponse, next: NextFunction) {
    const TABLE_NAME = req.params.table
    const TABLE_CONFIG = getTableConfig(TABLE_NAME)

    if (!req.body.data) {
      next(new HttpException(500, 'Missing data object'))
      return
    }
    return requirementsCheck(TABLE_CONFIG, 'update', req.user, database).then(
      (DB) => {
        const acceptedColumns: string[] = []
        TABLE_CONFIG.columns.forEach(
          (column) => {
            if (column.model.type === 'datetime') {
              req.body.data[column.name] = new Date(req.body.data[column.name] || null)
            }
            if (req.body.data[column.name] !== undefined) {
              acceptedColumns.push(column.name)
            }
          }
        )

        const newData = normalizeData(req.body.data, TABLE_CONFIG)
        return Promise.all([
          DB,
          runHook(TABLE_CONFIG, 'updateRow', 'before', req, res, DB, newData),
        ])
      }
    ).then(
      ([DB, data]) => {
        let QUERY = DB(TABLE_NAME)
        QUERY = applyPKFilters(QUERY, req.body, TABLE_CONFIG)
        return QUERY.update(data)
      }
    ).then(
      (results) => {
        return runHook(TABLE_CONFIG, 'updateRow', 'after', req, res, database.db, results)
      }
    ).then(
      addToResponse(res, 'results')
    ).then(
      nextAndReturn(next)
    ).catch(
      (err) => {
        catchMiddleware(next, err)
      }
    )
  }

  public deleteRowData(req: IMCRequest, res: IMCResponse, next: NextFunction) {
    const TABLE_NAME = req.params.table
    const TABLE_CONFIG = getTableConfig(TABLE_NAME)

    return requirementsCheck(TABLE_CONFIG, 'delete', req.user, database).then(
      (DB) => {
        return Promise.all([
          DB,
          runHook(TABLE_CONFIG, 'deleteRow', 'before', req, res, database.db),
        ])
      }
    ).then(
      ([DB]) => {
        let QUERY = DB(TABLE_NAME)
        QUERY = applyPKFilters(QUERY, req.body, TABLE_CONFIG)
        return QUERY.del()
      }
    ).then(
      (results) => {
        return runHook(TABLE_CONFIG, 'deleteRow', 'after', req, res, database.db, results)
      }
    ).then(
      addToResponse(res, 'results')
    ).then(
      nextAndReturn(next)
    ).catch(
      (err) => {
        catchMiddleware(next, err)
      }
    )
  }

  private paginate(query: Knex.QueryBuilder, page: string | number, limit: string | number) {
    let LIMIT = 10
    let PAGE_NUMBER = 0
    if (page) {
      PAGE_NUMBER = typeof page === 'string' ? parseInt(page, 10) : page
    }
    if (limit) {
      LIMIT = typeof limit === 'string' ? parseInt(limit, 10) : limit
    }

    if (LIMIT > 0) {
      query.offset((PAGE_NUMBER) * LIMIT).limit(LIMIT)
    }

    return query
  }
}

export default TableController
