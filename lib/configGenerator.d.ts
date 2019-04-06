import { describeInfo, schemaInfo } from '@root/describeTable';
import { ITypeAnswers } from '@root/index';
import express from 'express';
import knex from 'knex';
declare type IHookFunction = (req: express.Request, res: express.Response, DB: knex, tableName: string, data?: any) => Promise<any>;
export declare type Hooks = 'getTableData' | 'getTableCount';
export interface ITableInfo {
    name: string;
    verbose: string;
    pk: string;
    searchFields?: string[];
    relations?: {
        manyToOne?: {
            [key: string]: string;
        };
    };
    columns: IColumnInfo[];
    visible: boolean;
    roles: string[];
    hooks?: {
        getTableData?: {
            before?: IHookFunction;
            after?: IHookFunction;
        };
        getTableCount?: {
            before?: IHookFunction;
            after?: IHookFunction;
        };
    };
}
export interface IColumnRelation {
    type: string;
    table: string;
    key: string;
    display: string;
}
export interface IColumnInfo {
    name: string;
    verbose: string;
    type: string;
    allowNull: boolean;
    visible: {
        main: boolean;
        detail: boolean;
    };
    editable: boolean;
    relation?: IColumnRelation;
}
export declare function generateSettings(DBData: Array<{
    schema: schemaInfo;
    describe: describeInfo;
}>): any;
export declare function generateConfig(answers: ITypeAnswers): void;
export {};
