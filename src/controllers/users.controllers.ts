import { NextFunction, Request, Response } from 'express'
import { User, UserDocument } from '../models/user.documents'
import UserModel from '../models/User.model'
import { groupsRoutesOptions } from '../config/defaultOptions'

class UserController {
  // Get all users info
  public async index (req: Request, res: Response, _next: NextFunction): Promise<void> {
    const n = req.query.n !== undefined ? Number(req.query.n) : groupsRoutesOptions.index.n
    const offset = req.query.a !== undefined ? Number(req.query.a) : groupsRoutesOptions.index.offset
    await UserModel.find({}, null, { skip: offset, limit: n })
      .then((users: UserDocument[]) => {
        const infoUser = users.map((user: UserDocument) => {
          return {
            name: user.name,
            username: user.username,
            email: user.email,
            groups: user.groups
          }
        })
        res.status(200).json(infoUser)
      })
      .catch((err): void => {
        res.status(500).json({ err })
        console.log('Error getting users', err.message)
      })
  }

  // Create new user
  public async createUser (req: Request, res: Response, _next: NextFunction): Promise<void> {
    const user = req.body
    const newUser: UserDocument = new UserModel(user as User)

    await newUser.save()
      .then((): void => {
        console.log('user saved')
        res.status(201)
      })
      .catch((err): void => {
        res.status(500).json({ err })
        console.log('Error saving group', err.message)
      })
  }

  // Get info of an specific user
  public async userInfo (req: Request, res: Response, _next: NextFunction): Promise<void> {
    const username = req.params.username
    const user = await UserModel.find({ username }, 'name username email groups')
    res.send(user)
  }

  // Test Route
  public async doomie (req: Request, res: Response, _next: NextFunction): Promise<void> {
    const n = req.query.n
    const offset = req.query.a
    console.log(n, offset)
    res.status(200).json({ n, offset })
  }
}

export default new UserController()
