import { GraphQLFloat, GraphQLInt, GraphQLList } from 'graphql'
import { Funfunz } from '../middleware'
import config from './configs/MCconfig'
import settings from './configs/MCsettings'
import httpServer from './httpServer'

if (process.env.JAWSDB_URL) {
  console.log('JAWSDB_URL', process.env.JAWSDB_URL)
  const DB_URL = process.env.JAWSDB_URL
  const userAndPass = DB_URL.split('@')[0].split('mysql://')[1]
  const [user, password] = userAndPass.split(':')
  const [hostname, database] = DB_URL.split('@')[1].split('/')
  const [host, port = '3306'] = hostname.split(':')
  config.connectors.mainDatabase.config = {
    client: 'mysql2',
    host,
    database: database.split('?')[0],
    user,
    password,
    port
  }
  console.log('mysql config', config.connectors.mainDatabase.config)
}

let randomNumberCount = 4

const funfunz = new Funfunz({
  context: {
    test: true,
  },
  config,
  settings,
  queries: {
    randomNumbers: {
      type: new GraphQLList(GraphQLFloat),
      description: 'This will return a list of random numbers.',
      resolve: () => {
        return Array.from({length: randomNumberCount}, () => Math.random())
      },
    }
  },
  mutations: {
    increaseRandomNumber: {
      type: GraphQLInt,
      description: 'This will increase and return the quantity of random numbers.',
      resolve: () => {
        return randomNumberCount += 1
      },
    },
    decreaseRandomNumber: {
      type: GraphQLInt,
      description: 'This will decrease and return the quantity of random numbers.',
      resolve: () => {
        return randomNumberCount -= 1
      },
    }
  }
})

/**
 * Create HTTP server if not loaded has a plugin.
 */

httpServer(funfunz.middleware)
