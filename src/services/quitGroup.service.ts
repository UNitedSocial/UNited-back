import mongoose from 'mongoose'
import GroupModel from '../models/Group.model'
import { GroupDocument } from '../models/group.documents'
import UserModel from '../models/User.model'
import { UserDocument } from '../models/user.documents'
import { Responses, ResponseStatus } from '../types/response.types'
import requestsServices from '../services/requests.service'

class QuitGroup {
  public async quitGroup (groupname: string, username: string): Promise<Responses> {
    const session = await mongoose.startSession()
    let response: Responses
    let groupDoc: GroupDocument | null
    let userDoc: UserDocument | null
    // Get group data
    try {
      groupDoc = await GroupModel.findOne({ 'info.name': groupname })
      userDoc = await UserModel.findOne({ username })
    } catch {
      response = {
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        message: 'Error getting group or user'
      }
      return response
    }

    // Check if group exist
    if (groupDoc == null || userDoc == null) {
      response = {
        status: ResponseStatus.NOT_FOUND,
        message: 'Group or User doesn\'t exist'
      }
      return response
    }

    // Check if user is in group
    if (!requestsServices.userIsInGroup(userDoc, groupDoc)) {
      response = {
        status: ResponseStatus.BAD_REQUEST,
        message: 'User isn\'t in the group'
      }
      return response
    }

    // Delete group from user
    userDoc?.groups.forEach((group) => {
      if (group.groupName === groupname) {
        console.log(userDoc?.groups.indexOf(group))
        userDoc?.groups.splice(userDoc?.groups.indexOf(group), 1)
      }
    })

    // Delete member from group
    groupDoc?.members.forEach((member) => {
      if (member.username === username) {
        console.log(groupDoc?.members.indexOf(member))
        groupDoc?.members.splice(groupDoc?.members.indexOf(member), 1)
      }
    })

    // Save changes
    try {
      await session.startTransaction()
      await groupDoc.save()
      await userDoc.save()
      await session.commitTransaction()
    } catch {
      response = {
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        message: 'Error saving group or user'
      }
      await session.abortTransaction()
    }

    response = {
      status: ResponseStatus.OK,
      message: 'Quit group successfully'
    }
    await session.endSession()

    return response
  }
}

export default new QuitGroup()
