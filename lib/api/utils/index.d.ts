import { HttpException, IMCRequest, IMCResponse, IUser } from '@root/api/types';
import { Hooks, IColumnInfo, ITableInfo } from '@root/configGenerator';
import { ErrorRequestHandler, NextFunction } from 'express';
import Knex from 'knex';
export declare function catchMiddleware(next: NextFunction): (err: HttpException) => Promise<never>;
export declare function buildError(message: string, status: number): HttpException;
export declare function addToResponse(res: IMCResponse, target: string): (data: any) => IMCResponse;
export declare function nextAndReturn(next: NextFunction): (data: any) => Promise<any>;
export declare const errorHandler: ErrorRequestHandler;
export declare function hasAuthorization(tableRoles: string[], user?: IUser): boolean;
export declare function filterVisibleTableColumns(table: ITableInfo, target: 'main' | 'detail'): string[];
export declare function runHook(TABLE: ITableInfo, hook: Hooks, instance: 'after' | 'before', req: IMCRequest, res: IMCResponse, database: Knex | null, results: any): Promise<any>;
export declare function getTableConfig(TABLE_NAME: string): ITableInfo;
export declare function getColumnsByName(TABLE_CONFIG: ITableInfo): {
    [key: string]: IColumnInfo;
};
export declare function applyQueryFilters(QUERY: Knex.QueryBuilder, filters: string, TABLE_CONFIG: ITableInfo): Knex.QueryBuilder;
