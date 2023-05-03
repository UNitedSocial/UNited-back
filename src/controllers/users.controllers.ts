import { NextFunction, Request, Response } from 'express'
import { displayOptions } from '../config/defaultOptions.config'
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
}

export default new UserController()
