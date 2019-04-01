import { IMCRequest, IMCResponse } from '@root/api/types';
import Bluebird from 'bluebird';
import { NextFunction, Request } from 'express';
declare class TableController {
    constructor();
    getTableConfig(req: IMCRequest, res: IMCResponse, next: NextFunction): Promise<any>;
    getTableData(req: IMCRequest, res: IMCResponse, next: NextFunction): Promise<any> | undefined;
    getTableCount(req: IMCRequest, res: IMCResponse, next: NextFunction): Bluebird<void> | Promise<never>;
    getRow(req: IMCRequest, res: IMCResponse, next: NextFunction): Bluebird<any> | Promise<never>;
    insertRow(req: Request, res: IMCResponse, next: NextFunction): Bluebird<any> | Promise<never>;
    updateRow(req: Request, res: IMCResponse, next: NextFunction): Bluebird<any> | Promise<never>;
    deleteRow(req: Request, res: IMCResponse, next: NextFunction): Bluebird<any> | Promise<never>;
    private addVerboseRelatedData;
    private getRelationQueries;
    private getRelatedRow;
    private mergeRelatedData;
}
export default TableController;
