import { groupsRoutesOptions } from '../config/defaultOptions'
import { NextFunction, Request, Response } from 'express'
import UserModel from '../models/User.model'
import GroupModel from '../models/Group.model'
import { User, UserDocument } from '../models/user.documents'

class UserController {
  // Get all users info
  public async getUsers (req: Request, res: Response, _next: NextFunction): Promise<void> {
    // Get params or use default values for users display
    const n = (req.query.n !== undefined) ? Number(req.query.n) : groupsRoutesOptions.index.n
    const offset = (req.query.a !== undefined) ? Number(req.query.a) : groupsRoutesOptions.index.offset
    // Get users
    await UserModel.find({}, { _id: 0, __v: 0 }, { skip: offset, limit: n })
      .then((users: UserDocument[]) => {
        // Check if there are groups to show
        if (users.length === 0) {
          res.status(404).send({ err: 'There are no users to show' })
          return
        }
        res.status(200).json(users)
      })
      .catch((err): void => {
        res.status(500).json({ err })
        console.log('Error getting users', err.message)
      })
  }

  // Create new user
  public async createUser (req: Request, res: Response, _next: NextFunction): Promise<void> {
    const { user } = req.body
    const middleUser: User = {
      username: user?.nickname,
      name: user?.name,
      email: user?.email,
      groups: [],
      requests: []
    }
    const newUser: UserDocument = new UserModel(middleUser)
    await newUser.save()
      .then((): void => {
        res.status(201).send({ message: 'User created successfully' })
        console.log('User created successfully')
      })
      .catch((err): void => {
        res.status(500).json({ err })
        console.log('Error creating user', err.message)
      })
  }

  // Quit  group
  public async quitGroup (req: Request, res: Response, _next: NextFunction): Promise<void> {
    // in the future implement verification of finding group and user before modifying the database.

    const { name, user } = req.body
    const username = user?.nickname
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
    await GroupModel.findOne({ 'info.name': name })
      .then((group): void => {
        if (group === null) {
          res.status(404).send({ err: 'Group not found' })
          return
        }
        console.log('group found')

        for (let i = 0; i < group.members.length; i++) {
          const usuarios = group.members[i]
          if (usuarios.username === username) {
            group.members.splice(i, 1)
          }
        }

        /* await */ group.save()
          .then((): void => {
            console.log('Deleted Group')
            res.status(201).send({ message: 'User quit group successfully' })
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
    await UserModel.find({ username }, { _id: 0, __v: 0 })
      .then((user) => {
        if (user.length === 0) {
          res.status(404).send({ err: 'User not found' })
          return
        }
        res.status(200)
        res.send(user)
      })
      .catch((err): void => {
        res.status(500).send({ err })
        console.log('Error finding user', err.message)
      })
  }

  public async userStateGroup (req: Request, res: Response, _next: NextFunction): Promise<void> {
    const username = (req.query.username !== undefined) ? req.query.username : ''
    const groupName = (req.query.groupname !== undefined) ? req.query.groupname : ''
    if (username === '' || groupName === '') {
      res.status(400).send({ err: 'Bad request, missing username or/and groupname' })
      return
    }
    const userDocument: UserDocument | null = await UserModel.findOne({ username })
    if (userDocument === null) {
      res.status(404).send({ err: 'User not found' })
      return
    }
    let state = 'notBelongs'
    userDocument.requests.forEach(element => {
      if (element.groupName === groupName && element.state === 'pending') {
        state = 'pending'
      }
    })
    userDocument.groups.forEach(element => {
      if (element.groupName === groupName) {
        state = 'belongs'
      }
    })
    console.log(username, 'state in group', groupName, ' is: "', state, '"')
    res.status(200).send({ state })
  }
}

export default new UserController()
