import express from 'express';
export declare class HttpException extends Error {
    status: number;
    message: string;
    constructor(status: number, message: string);
}
export interface MCResponse extends express.Response {
    data?: any;
}
