import { NextFunction, Request, Response } from 'express'
import UserModel from '../models/User.model'
import GroupModel from '../models/Group.model'
import { GroupDocument, RequestState, Requests } from '../models/group.documents'
import mongoose, { now } from 'mongoose'
import { UserDocument, requestUser } from '../models/user.documents'
class RequestController {
  // Test Route
  public async doomie (req: Request, res: Response, _next: NextFunction): Promise<void> {
    const n = req.query.n
    const offset = req.query.a
    console.log(n, offset)
    res.status(200).json({ n, offset })
  }

  // create a request
  public async createRequest (req: Request, res: Response, _next: NextFunction): Promise<void> {
    const { username, groupName } = req.body
    // get group and user models
    const group: GroupDocument | null = await GroupModel.findOne({ 'info.name': groupName })
    const user: UserDocument | null = await UserModel.findOne({ username })
    // create request object for user and for group
    if (group == null || user == null) {
      res.status(404).json({ message: 'user or group not found' })
      return
    }
    console.log(new mongoose.Types.ObjectId(group._id))
    console.log(new mongoose.Types.ObjectId(user._id))
    const requestUser: requestUser = {
      groupId: new mongoose.Types.ObjectId(group._id),
      groupName: group.info.name,
      date: new Date(now()),
      state: RequestState.pending
    }
    const requestGroup: Requests = {
      userId: new mongoose.Types.ObjectId(user._id),
      username: user.username,
      name: user.name,
      date: new Date(now()),
      state: RequestState.pending
    }
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
