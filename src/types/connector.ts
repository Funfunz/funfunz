import { Funfunz } from '..'
import { IRelationMN } from '../generator/configurationTypes'
import { IFilter } from '../middleware/utils/filter'

export interface IQueryArgs {
  entityName: string,
  count?: boolean,
  fields: string[],
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
  relatedData?: relatedData
  data: Record<string, unknown>
}

export type relatedData = {
  [entity: string]: IRelationMN & {
    value: unknown,
  }
}

export interface ICreateArgs {
  entityName: string,
  count?: boolean,
  fields?: string[],
  skip?: number,
  take?: number,
  relatedData?: relatedData
  data: Record<string, unknown>,

}

export interface IRemoveArgs {
  entityName: string,
  filter: IFilter
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IDataConnector<Config = unknown> {
    connector: Connector,
    config: Config
}

export abstract class DataConnector {
  public abstract query(args: IQueryArgs): Promise<unknown[] | unknown>

  public abstract update(args: IUpdateArgs): Promise<unknown[] | unknown>

  public abstract create(args: ICreateArgs): Promise<unknown[] | unknown>

  public abstract remove(args: IRemoveArgs): Promise<number>
  
  public abstract connection: unknown
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Connector = (new (connector: IDataConnector<any>, funfunz: Funfunz) => DataConnector) & { [key: string]: unknown }