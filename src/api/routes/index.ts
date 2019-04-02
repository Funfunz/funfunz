import TableController from '@root/api/controllers/TableController'
import TablesController from '@root/api/controllers/TablesController'
import { sendJSON } from '@root/api/middleware/response'
import config from '@root/api/utils/configLoader'
import { Router } from 'express'
import fs from 'fs'
import path from 'path'

class IndexRouter {
  public router: Router
  constructor(router?: Router) {
    const tablesController = new TablesController()
    const tableController = new TableController()

    this.router = router || Router()
    this.router.get('/tables',
      (req, res, next) => {
        tablesController.getTables(req, res, next)
      },
      sendJSON('tables')
    )
    this.router.get('/table/:table/config',
      (req, res, next) => {
        tableController.getTableConfig(req, res, next)
      },
      sendJSON('results')
    )
    this.router.get('/table/:table/count',
    (req, res, next) => {
      tableController.getTableCount(req, res, next)
    },
    sendJSON('count')
    )
    this.router.get('/table/:table',
      (req, res, next) => {
        tableController.getTableData(req, res, next)
      },
      sendJSON('results')
    )
    this.router.get('/:table/:id',
      (req, res, next) => {
        tableController.getRow(req, res, next)
      },
      sendJSON('result')
    )
    this.router.put('/:table/:id',
      (req, res, next) => {
        tableController.updateRow(req, res, next)
      },
      sendJSON('results')
    )
    this.router.post('/:table',
      (req, res, next) => {
        tableController.insertRow(req, res, next)
      },
      sendJSON('results')
    )
    this.router.delete('/:table/:id',
      (req, res, next) => {
        tableController.deleteRow(req, res, next)
      },
      sendJSON('results')
    )

    if (config().defaultInterface) {
      this.router.get('*', function(req, res) {
        fs.readFile(path.join(__dirname, '../public/index.html'), function(err, data) {
          if (err) {
            res.status(500).send({error: 'No html available'})
          } else {
            res.set('Content-Type', 'text/html')
            res.send(data)
          }
        })
      })
    }
  }

  public getRouter(): Router {
    return this.router
  }
}

export default IndexRouter
