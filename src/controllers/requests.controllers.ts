import { NextFunction, Request, Response } from 'express'
import createRequestServices from '../services/createRequest.service'
import getRequestsServices from '../services/getRequests.service'
import answerRequestServices from '../services/answerRequest.service'

class RequestsController {
  // Create a request
  public async createRequest (req: Request, res: Response, _next: NextFunction): Promise<void> {
    // Get group and user data
    const groupname = req.params.groupname
    const { user } = req.body
    // Call service
    const response = await createRequestServices.createRequest(groupname, user.username)
    console.log(response.message)
    res.status(response.status).send({ answer: response.answer, message: response.message })
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
    const groupname = req.params.groupname
    const { username, answer } = req.body
    // Call service
    const response = await answerRequestServices.answerRequest(groupname, username, answer)
    console.log(response.message)
    res.status(response.status).send({ answer: response.answer, message: response.message })
  }
}

export default new RequestsController()
