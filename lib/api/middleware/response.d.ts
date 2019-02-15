/// <reference types="express-serve-static-core" />
import { MCResponse } from '@root/api/types';
export declare function sendJSON(target: string): (req: Express.Request, res: MCResponse) => void;
