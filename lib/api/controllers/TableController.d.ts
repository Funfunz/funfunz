import { IMCResponse } from '@root/api/types';
import { NextFunction, Request } from 'express';
declare class TableController {
    settings: any[];
    constructor();
    getTableData(req: Request, res: IMCResponse, next: NextFunction): void;
    insertRow(req: Request, res: IMCResponse, next: NextFunction): void;
    updateRow(req: Request, res: IMCResponse, next: NextFunction): void;
    deleteRow(req: Request, res: IMCResponse, next: NextFunction): void;
}
export default TableController;
