import fs from 'fs'
import path from 'path'
import { deleteFolderRecursive, isEmptyFolder, parse } from '../src/generator/index'

const targetPath = path.join(process.cwd(), '/test/generatedConfigs')
deleteFolderRecursive(targetPath)

describe('parse mongo', () => {
  it('checks if the target folder is empty', () => {
    expect(isEmptyFolder(targetPath)).toBeTruthy()
    fs.mkdirSync(targetPath)
    expect(isEmptyFolder(targetPath)).toBeTruthy()
    deleteFolderRecursive(targetPath)
  })

  it('should generate the required files', (done) => {
    parse({
      DBHost: 'localhost',
      DBName: 'Northwind',
      DBUser: '',
      DBPassword: '',
    }, 'mongoDB', targetPath).then(
      () => {
        expect(true).toBeTruthy()
        expect(fs.existsSync(targetPath)).toBeTruthy()
        expect(fs.readdirSync(targetPath).length).toBeGreaterThan(0)
        done()
      }
    )
  })
})
