import mongoose from 'mongoose'
import UserModel from '../models/User.model'
import GroupModel from '../models/Group.model'
import { UserDocument } from '../models/user.documents'
import { GroupDocument, Role } from '../models/group.documents'
import { Responses, ResponseStatus } from '../types/response.types'

class ChangeRole {
  public async changeRole (groupname: string, username: string, role: string): Promise<Responses> {
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

    // Update group members
    groupDoc.members.forEach(member => {
      if (member.username === username) {
        member.role = role as Role
      }
    })

    // Update user Role
    userDoc.groups.forEach(group => {
      if (group.groupName === groupname) {
        group.role = role as Role
      }
    })

    // Save changes
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
      status: ResponseStatus.OK,
      message: 'Role updated succesfully'
    }
    await session.endSession()

    return response
  }
}

export default new ChangeRole()
