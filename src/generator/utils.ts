import fs from 'fs'

export function deleteFolderRecursive(pathSelected: string) {
  if (fs.existsSync(pathSelected)) {
    fs.readdirSync(pathSelected).forEach((file) => {
      const curPath = pathSelected + '/' + file
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath)
      } else {
        fs.unlinkSync(curPath)
      }
    })
    if (pathSelected.split('/').pop() !== '.') {
      fs.rmdirSync(pathSelected)
    }
  }
}

export function isEmptyFolder(pathSelected: string) {
  if (fs.existsSync(pathSelected)) {
    return fs.readdirSync(pathSelected).length <= 0
  }
  return true
}
