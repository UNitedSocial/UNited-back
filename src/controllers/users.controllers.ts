import { NextFunction, Request, Response } from 'express'
import { User, UserDocument } from '../models/user.documents'
import UserModel from '../models/User.model'
import GroupModel from '../models/Group.model'
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
        console.log('User created successfully')
        res.status(201)
        res.send(newUser)
      })
      .catch((err): void => {
        res.status(500).json({ err })
        console.log('Error creating user', err.message)
      })
  }

  // Quit  group
  public async logOutGroup (req: Request, res: Response, _next: NextFunction): Promise<void> {
    const { name, username } = req.body
    // Find user and delete group from groups
    await UserModel.findOne({ username })
      .then((user): void => {
        if (user === null) {
          res.status(404).send({ err: 'User not found' })
          return
        }
        console.log('user found')

        for (let i = 0; i < user.groups.length; i++) {
          const nombregrupo = user.groups[i]
          if (nombregrupo.groupName === name) {
            user.groups.splice(i, 1)
          }
        }

        /* await */user.save()
          .then((): void => {
            console.log('Deleted User')
            res.status(201)
          })
          .catch((err): void => {
            res.status(500).json({ err })
            console.log('Error deleting user', err.message)
          })
      })
      .catch((err): void => {
        res.status(500).json({ err })
        console.log('Error finding user', err.message)
      })

    // Find group and delete user from members
    await GroupModel.findOne({ name })
      .then((groupname): void => {
        if (groupname === null) {
          res.status(404).send({ err: 'Group not found' })
          return
        }
        console.log('group found')

        for (let i = 0; i < groupname.members.length; i++) {
          const usuarios = groupname.members[i]
          if (usuarios.username === username) {
            groupname.members.splice(i, 1)
          }
        }

        /* await */ groupname.save()
          .then((): void => {
            console.log('Deleted Group')
            res.status(201)
          })
          .catch((err): void => {
            res.status(500).json({ err })
            console.log('Error deleting group', err.message)
          })
      })
      .catch((err): void => {
        res.status(500).json({ err })
        console.log('Error finding group', err.message)
      })
  }

  // Get info of an specific user
  public async userInfo (req: Request, res: Response, _next: NextFunction): Promise<void> {
    const username = req.params.username
    await UserModel.find({ username }, 'name username email groups')
      .then((infoUser) => {
        if (infoUser.length === 0) {
          res.status(404).send({ err: 'User not found' })
          return
        }
        res.status(200)
        res.send(infoUser)
      })
      .catch((err): void => {
        res.status(500).send({ err })
        console.log('Error finding user', err.message)
      })
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
