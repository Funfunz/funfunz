import { IMCResponse } from '@root/api/types'

// middleware that picks the property "data" on the response and sends it has a json
export function sendJSON(target: string) {
  return (req: Express.Request, res: IMCResponse) => {
    if (res.data && target) {
      res.json(res.data[target])
      return
    }
    res.json({})
  }
}
