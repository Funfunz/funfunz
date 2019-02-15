import { MCResponse } from '@root/api/types'

// middleware that picks the property "data" on the response and sends it has a json
export function sendJSON (target: string) {
  return (req: Express.Request, res: MCResponse) => {
    if (res.data) {
      if (target) {
        res.json(res.data[target])
      } else {
        res.json(res.data)
      }
    } else {
      res.json({})
    }
  }
}
