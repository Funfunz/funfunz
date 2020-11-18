import fs from 'fs'
import FormData from 'form-data'
import fetch from 'node-fetch'

describe('My First Test', function() {
  it('Create User with user API', (done) => {

    const o = {
      query: `mutation ($file: Upload!) {
addS3Entity (
          data: {
            file: $file
          }
        ) {
          Key
        }
      }`,
      variables: {
        file: null
      }
    }
    const map = {
      '0': ['variables.file']
    }
    const formData = new FormData()
    formData.append('operations', JSON.stringify(o))
    formData.append('map', JSON.stringify(map))
    const stream = fs.createReadStream(`${__dirname}/S3DataConnector.test.ts`, {encoding: 'utf8'})

    formData.append('0', stream, 'S3DataConnector.test.ts')
    
    fetch('http://localhost:3004', {
      method: 'POST',
      headers: {
        ...formData.getHeaders()
      },
      body: formData
    }).then(
      (res) => {
        return res.json()
      }
    ).then(
      (res) => {
        console.log(JSON.stringify(res, null, 2))
        done()
      }
    )
  })
})
