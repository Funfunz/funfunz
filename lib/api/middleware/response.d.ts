/// <reference types="express-serve-static-core" />
import { IMCResponse } from '@root/api/types';
export declare function sendJSON(target: string): (req: Express.Request, res: IMCResponse) => void;
