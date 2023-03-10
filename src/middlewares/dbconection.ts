import mongoose from 'mongoose'
import { Request, Response, NextFunction } from 'express'
class DBConections {
  public async connectdb (_req: Request, resp: Response, next: NextFunction): Promise<void> {
    let fine = true
    // try to connect to MongoDB
    await mongoose.connect(process.env.CONECTIONSTRING as string, {})
      .then(() => {
        console.log('Connected to MongoDB')
      })
      .catch((err) => {
        // if error, send error and stop
        resp.status(500).json({ err })
        console.log('Error connecting to MongoDB', err.message)
        fine = false
      })
    // if all is fine, continue
    if (fine) {
      await next()
    }
  }
}

export default new DBConections()
