import { IMCRequest, IMCResponse } from '@root/api/types';
import { ITableInfo } from '@root/configGenerator';
import { NextFunction } from 'express';
declare class TablesController {
    settings: ITableInfo[];
    constructor();
    getTables(req: IMCRequest, res: IMCResponse, next: NextFunction): Promise<any>;
}
export default TablesController;
