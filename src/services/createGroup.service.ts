import mongoose, { now } from 'mongoose'
import GroupModel from '../models/Group.model'
import UserModel from '../models/User.model'
import { GroupDocument, Role, MemberState, Member } from '../models/group.documents'
import { UserDocument, UserGroup } from '../models/user.documents'
import { Responses, ResponseStatus } from '../types/response.types'
import GroupService from './groups.service'

interface validation {
  valid: boolean
  message: string
}

class CreateGroup {
  public async createGroup (group: GroupDocument, username: string): Promise<Responses> {
    let response: Responses
    let userDoc: UserDocument | null = null

    // // Check if all info is provided
    const validate = this.validateGroup(group.info)
    if (group === undefined || group.info === undefined || !validate.valid) {
      response = {
        status: ResponseStatus.BAD_REQUEST,
        message: validate.message
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

  public validateGroup (info: any): validation {
    let message = ''
    let valid = true
    if (typeof info.name !== 'string' || typeof info.description !== 'string') {
      message += 'Missing group description or group name'
      valid = false
      return {
        valid,
        message
      }
    }
    if (info.name.length < 5 || info.name.length > 30) {
      message += 'Group name must be at least 5 characters long and less than 30\n'
      valid = false
    }
    if (info.description.length > 400) {
      message += 'Group description must be less than 400 characters long\n'
      valid = false
    }
    if (typeof info.contact !== 'object') {
      message += 'Missing contact information\n; contact must have email, phone and social networks\n'
      valid = false
    } else {
      if (typeof info.contact.mail !== 'string' || typeof info.contact.cellphone !== 'string' || typeof info.contact.socialNetworks !== 'object') {
        message += 'Missing email, phone or social networks\n'
        valid = false
      }
    }
    if (typeof info.isRecognized !== 'boolean') {
      message += 'Missing isRecognized\n'
      valid = false
    }
    if (!Array.isArray(info.topics)) {
      message += 'Missing topics, if there are no topics, send empty array []\n'
      valid = false
    }
    return {
      valid,
      message
    }
  }
}

export default new CreateGroup()
