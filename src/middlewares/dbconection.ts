import mongoose from 'mongoose'
import { Request, Response, NextFunction } from 'express'
class DBConections {
  public async connectdb (_req: Request, resp: Response, next: NextFunction): Promise<void> {
    let fine = true
    await mongoose.connect(process.env.CONECTIONSTRING as string, {}).then(() => {
      console.log('Connected to MongoDB')
    }).catch((err) => {
      resp.status(500).json({ err })
      console.log('Error connecting to MongoDB', err.message)
      fine = false
    })
    if (fine) {
      await next()
    }
  }
}

export default new DBConections()
