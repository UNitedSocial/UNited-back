import { NextFunction, Request, Response } from 'express'
import { User, UserDocument } from '../models/user.documents'
import UserModel from '../models/User.model'
import mongoose from 'mongoose'
import { groupsRoutesOptions } from '../config/defaultOptions'

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
            email: user.email
          }
        })
        res.status(200).json(infoUser)
      })
      .catch((err): void => {
        res.status(500).json({ err })
        console.log('Error getting users', err.message)
      })
    await mongoose.connection.close().catch((err): void => {
      console.log('Error closing connection', err.message)
    })
    console.log('Connection closed')
  }

  public async createUser (req: Request, res: Response, _next: NextFunction): Promise<void> {
    const user = req.body
    const newUser: UserDocument = new UserModel(user as User)

    let fine = true
    await newUser.save()
      .then((): void => {
        console.log('Guardando usuario')
      })
      .catch((err): void => {
        res.status(500).json({ err })
        console.log('Error saving group', err.message)
        fine = false
      })
    if (fine) {
      res.status(201)
    }
    await mongoose.connection.close().catch((err): void => {
      console.log('Error closing connection', err.message)
    })
    console.log('Connection closed')
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
