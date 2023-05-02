import { Request, Response, NextFunction } from 'express'
import userService from '../services/user.service'

class UserMiddlewares {
  public async checkUserExist (req: Request, res: Response, next: NextFunction): Promise<void> {
    // Get user
    const { user } = req.body

    // Check if info is given
    if (user === undefined || user.username === undefined) {
      res.status(400).json({ message: 'Missing user information' })
      console.log('Missing user information')
      return
    }

    // Check if user exist
    const userExists = await userService.userExists(user.username)
    if (userExists) {
      next()
    } else {
      res.status(401).json({ message: 'User doesn\'t exists, you should create an account' })
      console.log('User doesn\'t exists, you should create an account')
    }
  }
}

export default new UserMiddlewares()
