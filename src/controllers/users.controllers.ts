import { NextFunction, Request, Response } from 'express'
import { displayOptions } from '../config/defaultOptions.config'
import UserModel from '../models/User.model'
import { UserDocument } from '../models/user.documents'

import createUserService from '../services/createUser.service'
import getUsersService from '../services/getUsers.service'
import seeUserService from '../services/seeUser.service'

class UserController {
  // Create new user
  public async createUser (req: Request, res: Response, _next: NextFunction): Promise<void> {
    // Get user data
    const { user } = req.body
    // Call service
    const response = await createUserService.createUser(user)
    console.log(response.message)
    res.status(response.status).send(response.answer)
  }

  // Get all users
  public async getUsers (req: Request, res: Response, _next: NextFunction): Promise<void> {
    // Get params or use default values for users display
    const index = (req.query.n !== undefined) ? Number(req.query.n) : displayOptions.index.n
    const offset = (req.query.o !== undefined) ? Number(req.query.o) : displayOptions.index.offset
    // Call service
    const response = await getUsersService.getUsers(index, offset)
    console.log(response.message)
    res.status(response.status).send(response.answer)
  }

  // Get info of an specific user
  public async seeUser (req: Request, res: Response, _next: NextFunction): Promise<void> {
    // Get username
    const username = req.params.username
    // Call service
    const response = await seeUserService.seeUser(username)
    console.log(response.message)
    res.status(response.status).send(response.answer)
  }

  // Refactor pending
  // Get user state in group
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
