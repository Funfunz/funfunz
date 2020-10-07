import { IFunfunzResponse } from '../types'

// middleware that picks the property "data" on the response and sends it has a json
export function sendJSON(target: string) {
  return (req: Express.Request, res: IFunfunzResponse) => {
    if (res.data && target) {
      res.json(res.data[target])
      return
    }
    res.json({})
  }
}
