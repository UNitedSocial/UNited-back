import { NextFunction, Request, Response } from 'express'
import { User, UserDocument } from '../models/user.documents'
import UserModel from '../models/User.model'
import { groupsRoutesOptions } from '../config/defaultOptions'
import { GroupDocument } from '../models/group.documents'

class UserController {
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

  public async logOutGroup (req: Request, _res: Response, _next: NextFunction): Promise<void> {
    const { name, username } = req.body
    const user = await UserModel.findOne({ username }) as UserDocument
    const groupname = await UserModel.findOne({ name }) as GroupDocument
    console.log(user)
    console.log(groupname)

    // await newUser.save()
    //   .then((): void => {
    //     console.log('user saved')
    //     res.status(201)
    //   })
    //   .catch((err): void => {
    //     res.status(500).json({ err })
    //     console.log('Error saving group', err.message)
    //   })
  }

  public async doomie (req: Request, res: Response, _next: NextFunction): Promise<void> {
    const n = req.query.n
    const offset = req.query.a
    console.log(n, offset)
    res.status(200).json({ n, offset })
  }

  public async user (req: Request, res: Response, _next: NextFunction): Promise<void> {
    const key = req.body
    const p = key.username
    const user = await UserModel.find({ username: p })
    res.send(user)
  }
}

export default new UserController()
