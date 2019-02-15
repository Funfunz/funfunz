import { MCResponse } from '@root/api/types';
import { NextFunction, Request } from 'express';
declare class TablesController {
    settings: Array<any>;
    constructor();
    getTables(req: Request, res: MCResponse, next: NextFunction): any;
}
export default TablesController;
