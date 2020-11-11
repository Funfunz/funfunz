import { IFilter } from '../middleware/utils/filter'

export interface IQueryArgs {
  entityName: string,
  count?: boolean,
  fields?: string[],
  filter?: IFilter,
  skip?: number,
  take?: number,
  relation?: string,
}

export interface IUpdateArgs {
  entityName: string,
  count?: boolean,
  fields?: string[],
  filter: IFilter,
  skip?: number,
  take?: number,
  data: Record<string, unknown>
}

export interface ICreateArgs {
  entityName: string,
  count?: boolean,
  fields?: string[],
  skip?: number,
  take?: number,
  data: Record<string, unknown>
}

export interface IRemoveArgs {
  entityName: string,
  filter: IFilter
}

export interface IDataConnector<C> {
    type: string,
    config: C
}

export abstract class DataConnector {
  
  private config: IDataConnector<unknown>['config']
  
  constructor(connector: IDataConnector<unknown>) {
    this.config = connector.config
  }

  public abstract query(args: IQueryArgs): Promise<unknown[] | unknown>

  public abstract update(args: IUpdateArgs): Promise<unknown[] | unknown>

  public abstract create(args: ICreateArgs): Promise<unknown[] | unknown>

  public abstract remove(args: IRemoveArgs): Promise<number>
}