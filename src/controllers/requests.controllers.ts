import { NextFunction, Request, Response } from 'express'
import UserModel from '../models/User.model'
import GroupModel from '../models/Group.model'
import { GroupDocument } from '../models/group.documents'
import { UserDocument } from '../models/user.documents'
import requestsServices from '../services/requests.service'
class RequestController {
  // Create a request
  public async createRequest (req: Request, res: Response, _next: NextFunction): Promise<void> {
    const { user, groupName } = req.body
    const username = user?.nickname
    // get group and user models
    const groupModel: GroupDocument | null = await GroupModel.findOne({ 'info.name': groupName })
    const userModel: UserDocument | null = await UserModel.findOne({ username })
    // check if group and user exist
    if (groupModel == null || userModel == null) {
      res.status(404).json({ message: 'user or group not found' })
      return
    }
    // vallidate if user is in the group or has an active request
    if (!requestsServices.validateUserRequest(userModel, groupModel)) {
      res.status(400).json({ message: 'The user has an active request or is alredy in the group' })
      return
    }
    // create request objects and save them
    const { requestUser, requestGroup } = requestsServices.createRequestObjects(userModel, groupModel)
    // save models in db
    userModel.requests?.push(requestUser)
    groupModel.requests?.push(requestGroup)
    try {
      await userModel.save()
      await groupModel.save()
      console.log(`user ${username as string} make a request to group ${groupName as string}`)
      res.status(200).json({ username, groupName })
    } catch (err: any) {
      console.log('error saving user or group', err.message)
      res.status(500).json({ message: 'error saving user or group', err })
    }
  }

  // Get requests of an specific group
  public async getRequests (req: Request, res: Response, _next: NextFunction): Promise<void> {
    const groupname = req.params.groupname
    await GroupModel.find({ 'info.name': groupname }, 'requests', { _id: 0 })
      .then((group: GroupDocument[]) => {
        if (group.length === 0) {
          res.status(404).send({ err: 'Group not found' })
          return
        }
        res.status(200)
        res.send(group)
      })
      .catch((err): void => {
        res.status(500).send({ err })
        console.log('Error finding group', err.message)
      })
  }

  public async confirmRequest (_req: Request, _res: Response, _next: NextFunction): Promise<void> {
  }
}

export default new RequestController()
