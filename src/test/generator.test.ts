// eslint-disable-next-line @typescript-eslint/no-var-requires
require('mysql2/node_modules/iconv-lite').encodingExists('foo')
import fs from 'fs'
import path from 'path'
import { parse } from '../generator/parser'
import { deleteFolderRecursive, isEmptyFolder } from '../generator/utils'

const mongoTargetPath = path.join(process.cwd(), '/src/test/generatedConfigsMongo')
deleteFolderRecursive(mongoTargetPath)

describe('parse mongo', () => {
  it('checks if the target folder is empty', () => {
    expect(isEmptyFolder(mongoTargetPath)).toBeTruthy()
    fs.mkdirSync(mongoTargetPath)
    expect(isEmptyFolder(mongoTargetPath)).toBeTruthy()
    deleteFolderRecursive(mongoTargetPath)
  })

  /*
  it('should generate the required files', (done) => {
    parse({
      DBHost: 'localhost',
      DBName: 'Northwind',
      DBUser: 'admin',
      DBPassword: process.env.DBPassword || 'password',
      DBPort: '27017',
      DBAuthSorce: 'admin',
      DBAuthMechanism: 'SCRAM-SHA-1',
    }, 'mongoDB', mongoTargetPath).then(
      () => {
        expect(true).toBeTruthy()
        expect(fs.existsSync(mongoTargetPath)).toBeTruthy()
        expect(fs.readdirSync(mongoTargetPath).length).toBeGreaterThan(0)
        deleteFolderRecursive(mongoTargetPath)
        done()
      }
    )
  })
  */
})

const mysqlTargetPath = path.join(process.cwd(), '/src/test/generatedConfigsMysql')
deleteFolderRecursive(mysqlTargetPath)

describe('parse mysql', () => {
  it('checks if the target folder is empty', () => {
    expect(isEmptyFolder(mysqlTargetPath)).toBeTruthy()
    fs.mkdirSync(mysqlTargetPath)
    expect(isEmptyFolder(mysqlTargetPath)).toBeTruthy()
    fs.mkdirSync(mysqlTargetPath + '/inner')
    deleteFolderRecursive(mysqlTargetPath)
  })

  it('should generate the required files', (done) => {
    parse({
      DBHost: '127.0.0.1',
      DBName: 'test_db',
      DBUser: 'root',
      DBPort: '3306',
      DBPassword: process.env.DB_PASSWORD || '',
    }, 'mysql', mysqlTargetPath).then(
      () => {
        expect(true).toBeTruthy()
        expect(fs.existsSync(mysqlTargetPath)).toBeTruthy()
        expect(fs.readdirSync(mysqlTargetPath).length).toBeGreaterThan(0)
        deleteFolderRecursive(mysqlTargetPath)
        done()
      }
    )
  })
})
