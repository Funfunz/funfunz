import Debug from 'debug'
import { S3 } from 'aws-sdk'
import { GraphQLInputObjectType } from 'graphql'
import { GraphQLUpload } from 'graphql-upload'
import type { FileUpload } from 'graphql-upload'
import type { GraphQLFieldConfig } from 'graphql'
import type { ICreateArgs, IQueryArgs, IRemoveArgs, IUpdateArgs, DataConnector, IDataConnector } from '../types/connector'
import type { IFilter } from '../middleware/utils/filter'
import type { ReadStream } from 'fs'
import type { IEntityInfo } from '../generator/configurationTypes'

const debug = Debug('funfunz:S3DataConnector')

type S3Config = {
  bucket: string
  region?: string,
  apiVersion?: string,
}

export const addMutation = (entity: IEntityInfo): Partial<GraphQLFieldConfig<unknown, unknown>> => ({
  args: {
    data: {
      description: 'Mutation data',
      type: new GraphQLInputObjectType({
        name: `input${entity.name}File`,
        description: `Data to update ${entity.name}`,
        fields: {
          file: {
            description: 'File to upload',
            type: GraphQLUpload,
          }
        },
      }),
    },
  }
})

export class Connector implements DataConnector{
  public connection: S3
  private config: S3Config
  constructor(connector: IDataConnector<S3Config>) {
    this.config = connector.config

    this.connection = new S3({
      apiVersion: this.config.apiVersion || '2006-03-01',
      region: this.config.region || 'us-west-2'
    })

    debug('Start')
    Object.keys(connector).forEach(
      (key) => {
        debug(key, (connector)[key])
      }
    )
    debug('End')
  }

  public query(args: IQueryArgs): Promise<Record<string, unknown>[]> {
    let keyFilter: {key: string, filter: string} | undefined = undefined
    if (args.filter) {
      keyFilter = this.getKeyFromFilter(args.filter) || undefined
    }

    return new Promise<S3.ObjectList>(
      (res, rej) => {
        this.connection.listObjectsV2(
          {
            Bucket: this.config.bucket,
            Prefix: keyFilter?.key
          },
          (err, data) => {
            if (err) {
              return rej(err)
            }
            res(data.Contents || [])
          }
        )
      }
    ).then(
      (data: S3.ObjectList) => {
        let result: Record<string, unknown>[] = data as unknown as Record<string, unknown>[]
        if (keyFilter?.filter === '_eq') {
          result = result.filter(
            (entry) => entry.Key === keyFilter?.key
          )
        }
        return result
      }
    )
  }

  public update(args: IUpdateArgs): Promise<Record<string, unknown>[] | Record<string, unknown> | number> {
    console.log(args)
    return Promise.resolve([])
  }

  public async create(args: ICreateArgs): Promise<Record<string, unknown>[] | Record<string, unknown>> {
    const { filename, createReadStream } = await args.data.file as FileUpload
    const stream = createReadStream() as ReadStream
    

    // Configure the file stream and obtain the upload parameters

    const uploadParams = {
      Bucket: this.config.bucket,
      Key: filename,
      Body: stream
    }

    // call S3 to retrieve upload file to specified bucket
    return new Promise(
      (res, rej) => {
        this.connection.upload(
          uploadParams,
          (err, data) => {
            if (err) {
              return rej(err)
            }
            if (data) {
              res(data)
            }
          }
        )
      }
    )
  }

  public remove(args: IRemoveArgs): Promise<number> {
    console.log(args)
    return Promise.resolve(0)
  }

  private getKeyFromFilter(filter: IFilter): {key: string, filter: string} | undefined {
    let result: {key: string, filter: string} | undefined = undefined
    Object.keys(filter).some(
      (filterKey) => {
        if (filterKey === 'Key') {
          const entry = filter[filterKey] as Record<string, string>
          if (entry._like !== undefined) {
            result = {
              key: entry._like,
              filter: '_like'
            }
          }
          if (entry._eq !== undefined) {
            result = {
              key: entry._eq,
              filter: '_eq'
            }
          }
        }
        if (filterKey === '_and' || filterKey === '_or') {
          const value = (filter[filterKey] as IFilter['_and'] | IFilter['_or']) || []
        
          value.forEach(
            (entry) => {
              const innerResult = this.getKeyFromFilter(entry)
              if (innerResult) {
                result = innerResult
              }
            }
          )
        }
        return !!result
      }
    )
    return result
  }
}