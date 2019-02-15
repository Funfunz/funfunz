import { HttpException, MCResponse } from '@root/api/types';
import { NextFunction } from 'express';
export declare function catchMiddleware(next: NextFunction): (err: HttpException) => {
    error: HttpException;
};
export declare function buildError(message: string, status: number): HttpException;
export declare function addToResponse(res: MCResponse, data: any, target: string): MCResponse;
export declare function nextAndReturn(next: NextFunction): (data: any) => any;
