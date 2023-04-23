import mongoose, { now } from 'mongoose'
import { NextFunction, Request, Response } from 'express'
import UserModel from '../models/User.model'
import GroupModel from '../models/Group.model'
import { UserDocument } from '../models/user.documents'
import { GroupDocument, Role, MemberState, RequestState, Requests } from '../models/group.documents'
import userService from '../services/user.service'
import groupsService from '../services/groups.service'
import requestsServices from '../services/requests.service'

class RequestController {
  // Create a request
  public async createRequest (req: Request, res: Response, _next: NextFunction): Promise<void> {
    const { user } = req.body
    const groupName = req.params.groupname
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
      console.log(`user ${username as string} make a request to group ${groupName}`)
      res.status(200).json({ username, groupName })
    } catch (err: any) {
      console.log('error saving user or group', err.message)
      res.status(500).json({ message: 'error saving user or group', err })
    }
  }

  // Get requests of an specific group
  public async getRequests (req: Request, res: Response, _next: NextFunction): Promise<void> {
    const groupname = req.params.groupname
    await GroupModel.findOne({ 'info.name': groupname }, 'requests', { _id: 0 })
      .then((group: GroupDocument | null | string) => {
        if (group === null || typeof group === 'string' || group instanceof String) {
          res.status(404).send({ err: 'Group not found' })
          return
        }
        const requests: Requests[] = []
        group.requests?.forEach((request) => {
          if (request.state === RequestState.pending) {
            requests.push(request)
          }
        })
        res.status(200)
        res.send({ requests })
      })
      .catch((err): void => {
        res.status(500).send({ err })
        console.log('Error finding group', err.message)
      })
  }

  // Answer a request
  public async answerRequest (req: Request, res: Response, _next: NextFunction): Promise<void> {
    const groupname = req.params.groupname
    const { username, answer } = req.body
    const groupModel: GroupDocument | null = await GroupModel.findOne({ 'info.name': groupname })
    const userModel: UserDocument | null = await UserModel.findOne({ username })

    let requestState: RequestState = RequestState.rejected
    let coincidence = false
    const newdate: Date = new Date(now())

    if (groupModel === null || userModel === null) {
      res.status(404).json({ message: 'user or group not found' })
      return
    }
    if (!['approve', 'reject'].includes(answer)) {
      res.status(400).json({ message: 'answer not allowed' })
      return
    }

    if (answer === 'approve') {
      requestState = RequestState.approved
      groupModel.info.numberOfMembers += 1
      groupModel.members.push({
        userId: new mongoose.Types.ObjectId(userModel?._id),
        username: userModel?.username,
        name: userModel?.name,
        role: 'member' as Role,
        state: 'active' as MemberState
      })

      userModel.groups.push({
        groupId: new mongoose.Types.ObjectId(groupModel?._id),
        groupName: groupModel.info.name,
        role: 'member' as Role,
        date: newdate
      })
    }

    // Aproove request or reject according to aproove value
    groupModel.requests.forEach(request => {
      if (userModel.username === request.username && request.state === RequestState.pending) {
        request.state = requestState
        request.approvedRejectedOn = newdate
        coincidence = true
      }
    })

    userModel.requests.forEach(request => {
      if (groupModel.info.name === request.groupName && request.state === RequestState.pending) {
        request.state = requestState
        request.approvedRejectedOn = newdate
        coincidence = true
      }
    })

    if (!coincidence) {
      res.status(404).json({ error: 'Request was not found' })
      return
    }

    // Save models in DB
    try {
      await userModel?.save()
      await groupModel?.save()
      res.status(200).send({ message: `${username as string}'s for group ${groupname} request was answered ` })
    } catch (err: any) {
      console.log('error updating user or group', err.message)
      res.status(500).json({ message: 'error updating user or group', err })
    }
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
