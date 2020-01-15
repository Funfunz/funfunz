import database from '@root/api/db'
import { HttpException } from '@root/api/types'
import {
  filterVisibleTableColumns,
  getColumnsWithRelations,
  getTableConfig,
} from '@root/api/utils'
import { IColumnRelation, IManyToOneRelation, ITableInfo } from '@root/generator/configurationTypes'
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
    display: relation.display,
    foreignKeyColumn: columnName,
  }
}

export function  addVerboseRelatedData(results: any[], TABLE_CONFIG: ITableInfo, DB: Knex) {
  const toRequest: IToRequest = {}
  const COLUMNS_WITH_RELATIONS = getColumnsWithRelations(TABLE_CONFIG)
  results.forEach(
    (row: any, index: number) => {
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

            toRequest[RELATION_TABLE_NAME].values.add(row[column.name])
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

  return Promise.all<any[]>(relationQueries).then(
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
            (relationRow: any) => {
              const CURRENT_VALUE = relationRow[requestedTable.key]
              const VALUE_TO_DISPLAY = relationRow[requestedTable.display]
              MATCHER[FOREIGN_KEY_COLUMN][CURRENT_VALUE] = VALUE_TO_DISPLAY
            }
          )
        }
      )
      return results.map(
        (row: any) => {
          Object.values(toRequest).forEach(
            (requestedTable) => {
              const ROW_KEY = requestedTable.foreignKeyColumn
              row[ROW_KEY] = MATCHER[ROW_KEY][row[ROW_KEY]]
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
  if (TABLE_CONFIG.relations && TABLE_CONFIG.relations.manyToOne) {
    const MANY_TO_ONE = TABLE_CONFIG.relations.manyToOne
    const KEYS: string[] = Object.keys(MANY_TO_ONE)
    KEYS.forEach(
      (tableName) => {
        relationQueries.push(
          getRelatedRow(
            tableName,
            MANY_TO_ONE[tableName],
            parentData
          )
        )
      }
    )
  }

  return relationQueries
}

export function  getManyToManyRelationQueries(TABLE_CONFIG: ITableInfo, parentData: any) {
  let relationQueries: Array<Promise<{}>> = []
  if (TABLE_CONFIG.relations && TABLE_CONFIG.relations.manyToMany) {
    if (!database.db) {
      throw new HttpException(500, 'No database')
    }
    const DB = database.db
    relationQueries = TABLE_CONFIG.relations.manyToMany.map(
      (relation) => {
        return DB(relation.relationTable).select().where(relation.foreignKey, parentData[relation.localId]).then(
          (relationResult: any) => {
            return relationResult.map(
              (relationRow: any) => relationRow[relation.remoteForeignKey]
            )
          }
        ).then(
          (relationRemoteIds) => {
            return Promise.all([
              relation.remoteTable,
              DB(relation.remoteTable).select().whereIn(relation.remoteId, relationRemoteIds),
            ])
          }
        )
      }
    )
  }

  return relationQueries
}

export function  getRelatedRow(tableName: string, columnNames: IManyToOneRelation[], parentData: any) {
  if (!database.db) {
    throw new HttpException(500, 'No database')
  }
  const TABLE_CONFIG = getTableConfig(tableName)

  const requestedColumns = filterVisibleTableColumns(TABLE_CONFIG, 'detail').filter(
    (column) => !columnNames.find((relatedData) => relatedData.fk.indexOf(column) >= 0)
  )

  const QUERY = database.db.select(requestedColumns).from(tableName)

  columnNames.forEach(
    (columnName, index) => {
      index === 0
        ? QUERY.where(columnName.fk, parentData[columnName.target])
        : QUERY.andWhere(columnName.fk, parentData[columnName.target])
    }
  )

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
