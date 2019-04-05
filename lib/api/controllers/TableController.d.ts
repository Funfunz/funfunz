import { IMCRequest, IMCResponse } from '@root/api/types';
import { NextFunction } from 'express';
declare class TableController {
    constructor();
    getTableConfig(req: IMCRequest, res: IMCResponse, next: NextFunction): Promise<any>;
    getTableData(req: IMCRequest, res: IMCResponse, next: NextFunction): Promise<any>;
    getTableCount(req: IMCRequest, res: IMCResponse, next: NextFunction): Promise<any>;
    getRow(req: IMCRequest, res: IMCResponse, next: NextFunction): Promise<any>;
    insertRow(req: IMCRequest, res: IMCResponse, next: NextFunction): Promise<any>;
    updateRow(req: IMCRequest, res: IMCResponse, next: NextFunction): Promise<any>;
    deleteRow(req: IMCRequest, res: IMCResponse, next: NextFunction): Promise<any>;
    private addVerboseRelatedData;
    private requirementsCheck;
    private getRelationQueries;
    private getRelatedRow;
    private mergeRelatedData;
}
export default TableController;
