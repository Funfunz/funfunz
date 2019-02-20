import { IMCResponse } from '@root/api/types';
import { NextFunction, Request } from 'express';
declare class TablesController {
    settings: any[];
    constructor();
    getTables(req: Request, res: IMCResponse, next: NextFunction): any;
}
export default TablesController;
