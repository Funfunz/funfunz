import { AnyMxRecord } from 'dns';
import express from 'express'

export class HttpException extends Error {
  public status: number;
  public message: string;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export interface IUser {
  [key: string]: any,
  roles: string[]
}

export interface IMCResponse extends express.Response {
  data?: any
}

export interface IMCRequest extends express.Request {
  user?: IUser;
}
