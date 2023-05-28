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

  public async checkWebmasterRole (req: Request, res: Response, next: NextFunction): Promise<void> {
    // Get user
    const { user } = req.body

    // Check if info is given
    if (user === undefined || user.username === undefined) {
      res.status(400).json({ message: 'Missing user information' })
      console.log('Missing user information')
    }
    // Check if user is webmaster
    const isWebmaster: boolean | null = await userService.isWebmaster(user.username)
    // If error
    if (isWebmaster === null) {
      res.status(500).json({ message: 'Error checking user role' })
      console.log('Error checking user role')
    } else if (isWebmaster) {
      console.log('User has webmaster role')
      next()
    } else {
      res.status(401).json({ message: 'User doesn\'t have webmaster role' })
      console.log('User doesn\'t have webmaster role')
    }
  }

  public async clearUserData (req: Request, _res: Response, next: NextFunction): Promise<void> {
    // Get user
    req.body.user = {
      username: 'Anonymous'
    }
    next()
  }
}

export default new UserMiddlewares()
