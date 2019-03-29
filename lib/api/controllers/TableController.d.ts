import { HttpException, IMCRequest, IMCResponse } from '@root/api/types';
import Bluebird from 'bluebird';
import { NextFunction, Request } from 'express';
declare class TableController {
    constructor();
    getTableConfig(req: IMCRequest, res: IMCResponse, next: NextFunction): Promise<any>;
    getTableData(req: IMCRequest, res: IMCResponse, next: NextFunction): Bluebird<any> | Promise<{
        error: HttpException;
    }>;
    getTableCount(req: IMCRequest, res: IMCResponse, next: NextFunction): Bluebird<void> | Promise<{
        error: HttpException;
    }>;
    getRow(req: IMCRequest, res: IMCResponse, next: NextFunction): Bluebird<any> | Promise<{
        error: HttpException;
    }>;
    insertRow(req: Request, res: IMCResponse, next: NextFunction): Bluebird<any> | Promise<{
        error: HttpException;
    }>;
    updateRow(req: Request, res: IMCResponse, next: NextFunction): Bluebird<any> | Promise<{
        error: HttpException;
    }>;
    deleteRow(req: Request, res: IMCResponse, next: NextFunction): Bluebird<any> | Promise<{
        error: HttpException;
    }>;
    private getRelationQueries;
    private getRelatedRow;
    private mergeRelatedData;
}
export default TableController;
