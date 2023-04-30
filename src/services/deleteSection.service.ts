import UserModel from '../models/User.model'
import GroupModel from '../models/Group.model'
import { UserDocument } from '../models/user.documents'
import { GroupDocument } from '../models/group.documents'
import { Responses, ResponseStatus } from '../models/response.documents'

import requestsService from './requests.service'

class DeleteSection {
  public async deleteSection (username: string, groupname: string): Promise<Responses> {
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
      await userDoc.save()
      await groupDoc.save()
    } catch {
      response = {
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        message: 'Error saving user or group'
      }
    }

    response = {
      status: ResponseStatus.CREATED,
      message: 'Request created succesfully'
    }

    return response
  }
}

export default new DeleteSection()
