import { IDatabaseData, IDescribeItem } from '../../generator/configurationTypes'
import { Db, MongoClient } from 'mongodb'

function mongoURIBuilder() {
  let mongoURI = 'mongodb://'
  const username = process.env.DBUser
  const password = process.env.DBPassword

  if (username && password) {
    mongoURI = `${mongoURI}${username}:${password}@`
  }

  mongoURI = `${mongoURI}${process.env.DBHost}:${process.env.DBPort || '27017'}/${process.env.DBAuthSorce || 'admin'}`

  const authMechanism = process.env.DBAuthMechanism
  if (authMechanism) {
    mongoURI = `${mongoURI}?authMechanism=${authMechanism}`
  }

  return mongoURI
}

interface IMongoConnection {
  connection: MongoClient,
  db: Db
}

function columnData(name: string): IDescribeItem {
  return {
    Field: name,
    Type: 'text',
    Null: 'true',
    Key: name === '_id' ? 'PRI' : '',
    Default: null,
    Extra: '',
  }
}

function buildCollectionData(
  items: Record<string, boolean>[],
  collection: {name: string}
): IDatabaseData {
  const columnNames: Record<string, boolean> = {}
  items.forEach(
    (item) => {
      Object.keys(item).forEach(
        (key) => {
          columnNames[key] = true
        }
      )
    }
  )

  const finalCollectionData: IDatabaseData = {
    describe: Object.keys(columnNames).map(
      columnData
    ),
    schema: [{
      TABLE_NAME: collection.name,
    }],
  }
  return finalCollectionData
}

const getDatabaseData = (): Promise<IDatabaseData[]> => {
  const client = new MongoClient(mongoURIBuilder(), { useUnifiedTopology: true })
  const promise: Promise<IMongoConnection> = new Promise(
    (res, rej) => {
      client.connect((err, connection) => {
        if (err) {
          rej(err)
        }

        const result: IMongoConnection = {
          connection,
          db: client.db(process.env.DBName),
        }
        res(result)
      })
    }
  )

  let mongoConnection: MongoClient
  let database: Db

  return promise.then(
    ({connection, db}: IMongoConnection) => {
      mongoConnection = connection
      database = db
      return database.listCollections().toArray()
    }
  ).then(
    (collections) => {
      const collectionsPromises = collections.map(
        (collection) => {
          return database.collection(collection.name).find().limit(10).toArray().then(
            (items) => {
              return buildCollectionData(items, collection)
            }
          )
        }
      )
      mongoConnection.close()
      return Promise.all(collectionsPromises)
    }
  )
}

export default getDatabaseData
