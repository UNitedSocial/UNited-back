import mongoose from 'mongoose'
import UserModel from '../models/User.model'
import GroupModel from '../models/Group.model'
import { UserDocument } from '../models/user.documents'
import { GroupDocument } from '../models/group.documents'
import { Responses, ResponseStatus } from '../types/response.types'

import requestsService from './requests.service'

class CreateRequest {
  public async createRequest (groupname: string, username: string): Promise<Responses> {
    const session = await mongoose.startSession()
    let response: Responses
    let groupDoc: GroupDocument | null
    let userDoc: UserDocument | null

    // Get group and user data
    try {
      groupDoc = await GroupModel.findOne({ 'info.name': groupname })
      userDoc = await UserModel.findOne({ username })
    } catch {
      response = {
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        message: 'Error getting user or group'
      }
      return response
    }

    // Check if group and user exist
    if (groupDoc == null || userDoc == null) {
      response = {
        status: ResponseStatus.NOT_FOUND,
        message: 'User or group doesn\'t exist'
      }
      return response
    }

    // Validate if user is in the group or has an active request
    if (!requestsService.validateUserRequest(userDoc, groupDoc)) {
      response = {
        status: ResponseStatus.BAD_REQUEST,
        message: 'The user has an active request or is already in the group'
      }
      return response
    }

    // Create request objects and save them
    const { requestUser, requestGroup } = requestsService.createRequestObjects(userDoc, groupDoc)
    userDoc.requests.push(requestUser)
    groupDoc.requests.push(requestGroup)
    try {
      await session.startTransaction()
      await userDoc.save()
      await groupDoc.save()
      await session.commitTransaction()
    } catch {
      response = {
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        message: 'Error saving user or group'
      }
      await session.abortTransaction()
    }

    response = {
      status: ResponseStatus.CREATED,
      message: 'Request created succesfully'
    }
    await session.endSession()

    return response
  }
}

export default new CreateRequest()
