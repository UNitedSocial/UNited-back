import { Request, Response, NextFunction } from 'express'
import userService from '../services/user.service'

class UserMiddlewares {
  public async checkUserExist (req: Request, res: Response, next: NextFunction): Promise<void> {
    // get and check username is given
    const { user } = req.body
    const username = user?.nickname
    if (username === undefined) {
      res.status(400).json({ message: 'Missing username' })
      console.log('Missing username')
      return
    }
    // check if user exist
    const userExists = await userService.userExists(username)
    if (userExists) {
      next()
    } else {
      res.status(400).json({ message: 'User do not exists' })
      console.log('User do not exists')
    }
  }
}
export default new UserMiddlewares()
