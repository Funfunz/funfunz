import database from '../db'
import { HttpException } from '../types'
import {
  filterVisibleTableColumns,
  getColumnsWithRelations,
  getPKs,
  getTableConfig,
} from '../utils'
import { IColumnRelation, IRelation, IRelationMN, ITableInfo } from '../../generator/configurationTypes'
import Knex from 'knex'

interface IToRequestItem {
  values: Set<number>,
  key: string,
  display: string,
  foreignKeyColumn: string
}

interface IToRequest {
  [key: string]: IToRequestItem,
}

function toRequestBuilder(relation: IColumnRelation, columnName: string): IToRequestItem {
  return {
    values: new Set<number>(),
    key: relation.key,
    display: '',
    foreignKeyColumn: columnName,
  }
}

export function  addVerboseRelatedData(results: Record<string, unknown>[], TABLE_CONFIG: ITableInfo, DB: Knex): Promise<unknown[]> {
  const toRequest: IToRequest = {}
  const COLUMNS_WITH_RELATIONS = getColumnsWithRelations(TABLE_CONFIG)
  results.forEach(
    (row) => {
      COLUMNS_WITH_RELATIONS.forEach(
        (column) => {
          if (row[column.name]) {
            if (!column.relation) {
              throw new HttpException(500, 'Column should have a relation')
            }
            const RELATION_TABLE_NAME = column.relation.table

            if (!toRequest[RELATION_TABLE_NAME]) {
              toRequest[RELATION_TABLE_NAME] = toRequestBuilder(column.relation, column.name)
            }
            toRequest[RELATION_TABLE_NAME].values.add(row[column.name] as number)
          }
        }
      )
    }
  )

  const relationQueries: Knex.QueryBuilder[] = []
  Object.keys(toRequest).forEach(
    (tableName) => {
      relationQueries.push(
        DB.select(toRequest[tableName].display, toRequest[tableName].key)
          .from(tableName)
          .whereIn(toRequest[tableName].key, Array.from(toRequest[tableName].values.values()))
      )
    }
  )

  return Promise.all<Record<string, unknown>[]>(relationQueries).then(
    (relationResults) => {
      const MATCHER: {
        [foreignKeyColumn: string]: {
          [value: string]: string
        }
      } = {}
      Object.values(toRequest).forEach(
        (requestedTable, index) => {
          const FOREIGN_KEY_COLUMN = requestedTable.foreignKeyColumn
          MATCHER[FOREIGN_KEY_COLUMN] = {}
          relationResults[index].forEach(
            (relationRow) => {
              const CURRENT_VALUE: string = relationRow[requestedTable.key] as string
              const VALUE_TO_DISPLAY = relationRow[requestedTable.display] as string
              MATCHER[FOREIGN_KEY_COLUMN][CURRENT_VALUE] = VALUE_TO_DISPLAY
            }
          )
        }
      )
      return results.map(
        (row) => {
          Object.values(toRequest).forEach(
            (requestedTable) => {
              const ROW_KEY = requestedTable.foreignKeyColumn
              row[ROW_KEY] = MATCHER[ROW_KEY][row[ROW_KEY] as string]
            }
          )
          return row
        }
      )
    }
  )
}

export function  getManyToOneRelationQueries(TABLE_CONFIG: ITableInfo, parentData: any) {
  const relationQueries: Array<Promise<{
    results: any[];
    tableName: string;
  }>> = []
  const MANY_TO_ONE = TABLE_CONFIG.relations && TABLE_CONFIG.relations.filter((r) => r.type === 'n:1')
  if (MANY_TO_ONE && MANY_TO_ONE.length > 0) {
    MANY_TO_ONE.forEach((relation) => {
      relationQueries.push(
        getRelatedRow(
          relation.remoteTable,
          relation,
          parentData
        )
      )
    })
  }

  return relationQueries
}

export function  getManyToManyRelationQueries(TABLE_CONFIG: ITableInfo, parentData: any) {
  let relationQueries: Array<Promise<{}>> = []
  const relations = TABLE_CONFIG.relations && TABLE_CONFIG.relations.filter((r) => r.type === 'm:n')
  if (relations && relations.length > 0) {
    if (!database.db) {
      throw new HttpException(500, 'No database')
    }
    const tablePks = getPKs(TABLE_CONFIG)
    if (tablePks.length > 1) {
      throw new Error('Multiple pks not supported for m:n relations')
    }
    const tablePk = tablePks[0]
    const DB = database.db
    relationQueries = relations.map((relation) => {
        return DB((relation as IRelationMN).relationalTable || relation.remoteTable).select()
          .where(relation.foreignKey, parentData[tablePk]).then(
          (relationResult: any) => {
            return relationResult.map(
              (relationRow: any) => {
                if (!(relation as IRelationMN).remoteForeignKey) {
                  throw new Error('Invalid remoteForeignKey key')
                }
                return relationRow[(relation as IRelationMN).remoteForeignKey]
              }
            )
          }
        ).then(
          (relationRemoteIds) => {
            const remoteTableConfig = getTableConfig(relation.remoteTable)
            const remoteTablePks = getPKs(remoteTableConfig)
            if (remoteTablePks.length > 1) {
              throw new Error('Multiple pks not supported for m:n relations')
            }
            const remoteTablePk = remoteTablePks[0]
            const requestedColumns = filterVisibleTableColumns(remoteTableConfig, 'relation')
            return Promise.all([
              relation.remoteTable,
              DB(relation.remoteTable).select(requestedColumns).whereIn(remoteTablePk, relationRemoteIds),
            ])
          }
        )
      }
    )
  }

  return relationQueries
}

export function getRelatedRow(tableName: string, tableRelation: IRelation, parentData: any) {
  if (!database.db) {
    throw new HttpException(500, 'No database')
  }
  const TABLE_CONFIG = getTableConfig(tableName)
  const tablePks = getPKs(TABLE_CONFIG);
  if (tablePks.length > 1) {
    throw new Error('Multiple pks not supported for n:1 relations')
  }
  const tablePk = tablePks[0]
  const requestedColumns = filterVisibleTableColumns(TABLE_CONFIG, 'relation')
  const QUERY = database.db.select(requestedColumns).from(tableName)
  QUERY.where(tablePk, parentData[tableRelation.foreignKey])

  return QUERY.then(
    (results) => {
      return {
        results,
        tableName,
      }
    }
  )
}

export function mergeRelatedData([results, manyToOneRelations, manyToManyRelations]: any) {
  if (manyToOneRelations && manyToOneRelations.length) {
    manyToOneRelations.forEach(
      (relation: {tableName: string, results: any[]}) => {
        results[relation.tableName] = relation.results
      }
    )
  }

  if (manyToManyRelations && manyToManyRelations.length) {
    manyToManyRelations.forEach(
      ([verbose, relationsData]: [string, any[]]) => {
        results[verbose] = relationsData
      }
    )
  }

  return results
}

export function getRelatedData(tableConfig: ITableInfo, result: any) {
  const manyToOneRelationQueries = getManyToOneRelationQueries(tableConfig, result)
  const manyToManyRelationQueries = getManyToManyRelationQueries(tableConfig, result)
  return Promise.all([
    result,
    Promise.all(manyToOneRelationQueries),
    Promise.all(manyToManyRelationQueries),
  ]).then(
    mergeRelatedData
  )
}
