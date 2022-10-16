import fs from 'fs'
import path from 'path'
import test from 'node:test'
import assert from 'node:assert'
import { parse } from '../generator/parser.js'
import { deleteFolderRecursive, isEmptyFolder } from '../generator/utils.js'

const mongoTargetPath = path.join(process.cwd(), '/src/test/generatedConfigsMongo')
deleteFolderRecursive(mongoTargetPath)

test('parse mongo', async (t) => {
  await t.test('checks if the target folder is empty', () => {
    assert.equal(!!isEmptyFolder(mongoTargetPath), true)
    fs.mkdirSync(mongoTargetPath)
    assert.equal(!!isEmptyFolder(mongoTargetPath), true)
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
        assert.equal(true).toBeTruthy()
        assert.equal(fs.existsSync(mongoTargetPath)).toBeTruthy()
        assert.equal(fs.readdirSync(mongoTargetPath).length).toBeGreaterThan(0)
        deleteFolderRecursive(mongoTargetPath)
        done()
      }
    )
  })
  */
})

const mysqlTargetPath = path.join(process.cwd(), '/src/test/generatedConfigsMysql')
deleteFolderRecursive(mysqlTargetPath)

test('parse mysql', async (t) => {
  await t.test('checks if the target folder is empty', () => {
    assert.equal(!!isEmptyFolder(mysqlTargetPath), true)
    fs.mkdirSync(mysqlTargetPath)
    assert.equal(!!isEmptyFolder(mysqlTargetPath), true)
    fs.mkdirSync(mysqlTargetPath + '/inner')
    deleteFolderRecursive(mysqlTargetPath)
  })

  await t.test('should generate the required files', (done) => {
    parse({
      DBHost: process.env.DB_HOST || '127.0.0.1',
      DBName: process.env.DB_NAME || 'test_db',
      DBUser: process.env.DB_USER || 'root',
      DBPort: process.env.DB_PORT || '3306',
      DBPassword: process.env.DB_PASS || 'password',
    }, 'mysql', mysqlTargetPath).then(
      () => {
        assert.equal(fs.existsSync(mysqlTargetPath), true)
        assert.equal(fs.readdirSync(mysqlTargetPath).length > 0, true)
        deleteFolderRecursive(mysqlTargetPath)
      }
    )
  })
})
