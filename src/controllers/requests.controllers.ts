import { NextFunction, Request, Response } from 'express'

class RequestController {
  // Test Route
  public async doomie (req: Request, res: Response, _next: NextFunction): Promise<void> {
    const n = req.query.n
    const offset = req.query.a
    console.log(n, offset)
    res.status(200).json({ n, offset })
  }

  // create a request
  public async createRequest (req: Request, res: Response, _next: NextFunction): Promise<void> {
    const { username, groupName } = req.body
    console.log(username, groupName)
    res.status(200).json({ username, groupName })
  }
}

export default new RequestController()
