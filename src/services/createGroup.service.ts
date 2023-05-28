import mongoose, { now } from 'mongoose'
import GroupModel from '../models/Group.model'
import UserModel from '../models/User.model'
import { GroupDocument, Role, MemberState, Member } from '../models/group.documents'
import { UserDocument, UserGroup } from '../models/user.documents'
import { Responses, ResponseStatus } from '../types/response.types'
import GroupService from './groups.service'

class CreateGroup {
  public async createGroup (group: GroupDocument, username: string): Promise<Responses> {
    let response: Responses
    let userDoc: UserDocument | null = null

    // // Check if all info is provided
    if (group === undefined || group.info === undefined) {
      response = {
        status: ResponseStatus.BAD_REQUEST,
        message: 'Missing group info'
      }
      return response
    }

    // Check is group name is already taken
    const exist = await GroupService.groupExists(group.info.name)
    if (exist) {
      response = {
        status: ResponseStatus.BAD_REQUEST,
        message: 'Group name already taken'
      }
      return response
    }

    // Get user info
    try {
      userDoc = await UserModel.findOne({ username })
    } catch {
      response = {
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        message: 'Error getting user'
      }
    }

    // Check if user exists
    if (userDoc == null) {
      response = {
        status: ResponseStatus.NOT_FOUND,
        message: 'User doesn\'t exist'
      }
      return response
    }

    // Create group and update members
    const newGroup: GroupDocument = new GroupModel(group)
    newGroup.info.numberOfMembers = 1
    newGroup.info.numberOfPublications = 0
    newGroup.info.creationDate = new Date(now())
    const member: Member = {
      userId: new mongoose.Types.ObjectId(userDoc?._id),
      username: userDoc?.username,
      name: userDoc?.name,
      role: 'editor' as Role,
      state: 'active' as MemberState
    }
    newGroup?.members.push(member)

    // Update groups in user model
    const userGroup: UserGroup = {
      groupId: new mongoose.Types.ObjectId(group?._id),
      groupName: group.info.name,
      role: Role.editor,
      date: new Date(now())
    }
    userDoc?.groups.push(userGroup)

    // Save Group and user data
    try {
      await newGroup.save()
      await userDoc.save()
    } catch {
      response = {
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        message: 'Error creating group'
      }
    }

    response = {
      answer: newGroup,
      status: ResponseStatus.CREATED,
      message: 'Group created successfully'
    }

    return response
  }
}

export default new CreateGroup()
