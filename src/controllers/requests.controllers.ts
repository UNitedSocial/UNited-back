import { NextFunction, Request, Response } from 'express'
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
}

export default new RequestController()
