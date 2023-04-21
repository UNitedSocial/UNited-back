import { NextFunction, Request, Response } from 'express'

class TestController {
  // Test route
  public async doomie (req: Request, res: Response, _next: NextFunction): Promise<void> {
    const n = req.query.n
    const offset = req.query.a
    console.log('Test completed sucessfully')
    res.status(200).json({ n, offset, message: 'Test completed successfully' })
  }
}

export default new TestController()
