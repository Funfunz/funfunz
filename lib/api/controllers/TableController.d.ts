import { HttpException, IMCRequest, IMCResponse } from '@root/api/types';
import { ITableInfo } from '@root/configGenerator';
import Bluebird from 'bluebird';
import { NextFunction, Request } from 'express';
declare class TableController {
    settings: ITableInfo[];
    constructor();
    getTableConfig(req: IMCRequest, res: IMCResponse, next: NextFunction): Promise<any>;
    getTableData(req: IMCRequest, res: IMCResponse, next: NextFunction): Bluebird<any> | Promise<{
        error: HttpException;
    }>;
    getTableCount(req: IMCRequest, res: IMCResponse, next: NextFunction): Bluebird<any> | Promise<{
        error: HttpException;
    }>;
    insertRow(req: Request, res: IMCResponse, next: NextFunction): void;
    updateRow(req: Request, res: IMCResponse, next: NextFunction): void;
    deleteRow(req: Request, res: IMCResponse, next: NextFunction): void;
}
export default TableController;
