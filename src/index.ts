// get the client
import tables from '@root/listTables'
import describe from '@root/describeTable'
import configGenerator from '@root/configGenerator'

tables.then(
  tablesNames => {
    describe(tablesNames).then(
      results => {
        configGenerator(results)
      }
    )
  }
)