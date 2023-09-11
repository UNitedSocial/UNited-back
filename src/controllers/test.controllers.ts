import { NextFunction, Request, Response } from 'express'
import { displayOptions } from '../config/defaultOptions.config'

class TestController {
  // Test route
  public async doomie (req: Request, res: Response, _next: NextFunction): Promise<void> {
    // Get params or use default values for groups display
    const index = (req.query.n !== undefined) ? Number(req.query.n) : displayOptions.index.n
    const offset = (req.query.o !== undefined) ? Number(req.query.o) : displayOptions.index.offset
    // Try connection in a route
    console.log('Test completed sucessfully')
    res.status(200).json({ index, offset, message: 'Test completed successfully' })
  }
}

export default new TestController()
