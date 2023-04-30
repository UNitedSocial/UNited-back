import { NextFunction, Request, Response } from 'express'
import { Role } from '../models/group.documents'
import userService from '../services/user.service'
import groupsService from '../services/groups.service'
import requestsServices from '../services/requests.service'

import getRequestsServices from '../services/getRequests.service'
import createRequestServices from '../services/createRequest.service'
import answerRequestServices from '../services/answerRequest.service'

class RequestController {
  // Create a request
  public async createRequest (req: Request, res: Response, _next: NextFunction): Promise<void> {
    // Get group and user data
    const { user } = req.body
    const groupname = req.params.groupname
    // Call service
    const response = await createRequestServices.createRequest(user.username, groupname)
    console.log(response.message)
    res.status(response.status).send(response.answer)
  }

  // Get requests of an specific group
  public async getRequests (req: Request, res: Response, _next: NextFunction): Promise<void> {
    // Get groupname
    const groupname = req.params.groupname
    // Call service
    const response = await getRequestsServices.getRequests(groupname)
    console.log(response.message)
    res.status(response.status).send(response.answer)
  }

  // Answer a request
  public async answerRequest (req: Request, res: Response, _next: NextFunction): Promise<void> {
    // Get group and user data
    const { username, answer } = req.body
    const groupname = req.params.groupname
    // Call service
    const response = await answerRequestServices.answerRequest(username, groupname, answer)
    console.log(response.message)
    res.status(response.status).send(response.answer)
  }

  // Change role of a user in a group
  public async changeRole (req: Request, res: Response, _next: NextFunction): Promise<void> {
    const groupname = req.params.groupname
    const userRequest = req.body.userRequest
    const adminUser = req.body.user.nickname
    const role = req.body.role
    if (groupname === undefined || userRequest === undefined || adminUser === undefined || role === undefined) {
      res.status(400).send({ message: 'Bad request' })
      return
    }
    const userExists = await userService.userExists(userRequest as string)
    const groupExists = await groupsService.groupExists(groupname)
    if (!userExists || !groupExists) {
      res.status(404).send({ message: 'User or group not found' })
      return
    }
    // aprrove request or reject according to aproove value
    const works = await requestsServices.changeRole(userRequest as string, groupname, role as Role)
      .catch((err): boolean => {
        console.log('Error changing role', err.message)
        return false
      })
    // send response
    if (works) {
      res.status(200).send({ message: 'change role to '.concat(role).concat(' successfully') })
    } else {
      res.status(500).send({ message: 'Error when changing role to '.concat(role) })
    }
  }
}

export default new RequestController()
