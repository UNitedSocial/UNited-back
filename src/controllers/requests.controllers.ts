import { NextFunction, Request, Response } from 'express'
import UserModel from '../models/User.model'
import GroupModel from '../models/Group.model'
import { GroupDocument } from '../models/group.documents'
import { UserDocument } from '../models/user.documents'
import requestsServices from '../services/requests.services'
class RequestController {
  // create a request
  public async createRequest (req: Request, res: Response, _next: NextFunction): Promise<void> {
    const { username, groupName } = req.body
    // get group and user models
    const group: GroupDocument | null = await GroupModel.findOne({ 'info.name': groupName })
    const user: UserDocument | null = await UserModel.findOne({ username })
    // check if group and user exist
    if (group == null || user == null) {
      res.status(404).json({ message: 'user or group not found' })
      return
    }
    // vallidate if user is in the group or has an active request
    if (!requestsServices.validateUserRequest(user, group)) {
      res.status(400).json({ message: 'The user has an active request or is alredy in the group' })
      return
    }
    // create request objects and save them
    const { requestUser, requestGroup } = requestsServices.createRequestObjects(user, group)
    // save models in db
    user.requests?.push(requestUser)
    group.requests?.push(requestGroup)
    try {
      await user.save()
      await group.save()
      console.log(`user ${username as string} make a request to group ${groupName as string}`)
      res.status(200).json({ username, groupName })
    } catch (err: any) {
      console.log('error saving user or group', err.message)
      res.status(500).json({ message: 'error saving user or group', err })
    }
  }
}

export default new RequestController()
