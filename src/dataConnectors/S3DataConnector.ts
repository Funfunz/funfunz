import Debug from 'debug'
import { S3, config } from 'aws-sdk'
import type { ICreateArgs, IQueryArgs, IRemoveArgs, IUpdateArgs, DataConnector, IDataConnector } from '../types/connector'
import { FilterValues, OperatorsType } from '../middleware/utils/filter'
import { createReadStream } from 'fs'
import path from 'path'

const debug = Debug('funfunz:S3DataConnector')

type S3Config = {
  bucket: string
  region?: string,
  apiVersion?: string,
}

export class Connector implements DataConnector{
  public connection: S3
  private config: S3Config
  constructor(connector: IDataConnector<S3Config>) {
    this.config = connector.config
    config.update({region: this.config.region || 'us-west-2'})
    this.connection = new S3({apiVersion: this.config.apiVersion || '2006-03-01'})

    debug('Start')
    Object.keys(connector).forEach(
      (key) => {
        debug(key, (connector)[key])
      }
    )
    debug('End')
  }

  public query(args: IQueryArgs): Promise<Record<string, unknown>[]> {
    let key = ''
    if (args.filter?.key) {
      const keyFilter = args.filter?.key as Record<Partial<OperatorsType>, FilterValues>
      if (!keyFilter?._like) {
        throw new Error('_like filter is required')
      }
      key = keyFilter._like as string
    }

    return new Promise<S3.ObjectList>(
      (res, rej) => {
        this.connection.listObjectsV2(
          {
            Bucket: this.config.bucket,
            Prefix: key
          },
          (err, data) => {
            if (err) {
              console.log('err', err)
              return rej(err)
            }
            console.log('data', data)
            res(data.Contents || [])
          }
        )
      }
    ).then(
      (data: S3.ObjectList) => {
        const fields = args.fields
        const result: Record<string, unknown>[]  = []
        data.forEach(
          (entry) => {
            const resultEntry = {}
            fields.forEach(
              (field) => {
                resultEntry[field] = entry[field]
              }
            )
            result.push(resultEntry)
          }
        )
        return result
      }
    )
  }

  public update(args: IUpdateArgs): Promise<Record<string, unknown>[] | Record<string, unknown> | number> {
    console.log(args)
    return Promise.resolve([])
  }

  public create(args: ICreateArgs): Promise<Record<string, unknown>[] | Record<string, unknown>> {
    console.log(args)
    const file = 'fileName.txt'

    // Configure the file stream and obtain the upload parameters
    
    const fileStream = createReadStream(file)
    fileStream.on('error', function(err) {
      console.log('File Error', err)
    })
    const Body = fileStream
    
    const Key = path.basename(file)

    const uploadParams = {Bucket: this.config.bucket, Key, Body}

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
}