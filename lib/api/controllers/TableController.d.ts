import { MCResponse } from '@root/api/types';
import { NextFunction, Request } from 'express';
declare class TableController {
    settings: Array<any>;
    constructor();
    getTableData(req: Request, res: MCResponse, next: NextFunction): void;
    insertRow(req: Request, res: MCResponse, next: NextFunction): void;
    updateRow(req: Request, res: MCResponse, next: NextFunction): void;
    deleteRow(req: Request, res: MCResponse, next: NextFunction): void;
}
export default TableController;
