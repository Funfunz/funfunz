import { HttpException, IMCResponse } from '@root/api/types';
import { ErrorRequestHandler, NextFunction } from 'express';
export declare function catchMiddleware(next: NextFunction): (err: HttpException) => {
    error: HttpException;
};
export declare function buildError(message: string, status: number): HttpException;
export declare function addToResponse(res: IMCResponse, data: any, target: string): IMCResponse;
export declare function nextAndReturn(next: NextFunction): (data: any) => any;
export declare const errorHandler: ErrorRequestHandler;
