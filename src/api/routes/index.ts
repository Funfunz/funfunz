import { Router } from 'express'
import { sendJSON } from '@root/api/middleware/response'
import TablesController from '@root/api/controllers/TablesController'
import TableController from '@root/api/controllers/TableController'

class IndexRouter {
  router: Router
  constructor (router?: Router) {
    const tablesController = new TablesController()
    const tableController = new TableController()

    this.router = router || Router()
    this.router.get('/tables',
      (req, res, next) => {
        tablesController.getTables(req, res, next)
      },
      sendJSON('tables')
    )
    this.router.get('/table/:table',
      (req, res, next) => {
        tableController.getTableData(req, res, next)
      },
      sendJSON('results')
    )
    this.router.put('/',
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
  }

  getRouter (): Router {
    return this.router
  }
}

export default IndexRouter