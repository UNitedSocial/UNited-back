import { Request, Response, NextFunction } from 'express'
import UserModel from '../models/User.model'

class UserMiddlewares {
  public async checkUserExist (req: Request, res: Response, next: NextFunction): Promise<void> {
    // get and check username is given
    const { username } = req.body
    if (username === undefined) {
      res.status(400).json({ message: 'Missing username' })
      console.log('Missing username')
      return
    }
    // check if user exist
    await UserModel.findOne({ username })
      .then((user) => {
        if (user !== null) {
          // user exist
          next()
          console.log(`user exist ${username as string}`)
        } else {
          // user not found
          res.status(404).json({ message: 'User not found' })
          console.log(`user not found ${username as string}`)
        }
      })
      // can't connect to db
      .catch((e) => {
        res.status(500).json({ message: e.message })
      })
  }
}
export default new UserMiddlewares()
