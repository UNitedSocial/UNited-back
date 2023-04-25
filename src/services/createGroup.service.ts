import mongoose, { now } from 'mongoose'
import GroupService from './groups.service'
import GroupModel from '../models/Group.model'
import { GroupInfo, GroupDocument, Role, MemberState, Group } from '../models/group.documents'
import UserModel from '../models/User.model'
import { UserDocument, UserGroup } from '../models/user.documents'

enum ResponseStatus {
  OK = 200,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500
}

interface ResponseService {
  status: ResponseStatus
  err?: string
  message?: string
}

class CreateGroup {
  public async createGroup (info: GroupInfo, username: string): Promise<ResponseService> {
    const exist = await GroupService.groupExists(info.name)
    let response: ResponseService
    if (exist) {
      response = {
        status: ResponseStatus.BAD_REQUEST,
        err: 'Group name already taken'
      }
      return response
    }
    const userModel = await UserModel.findOne({ username }) as UserDocument
    const group = this.createGroupModel(userModel, info)
    this.updateUserWhenCreateGroup(userModel, group)
    const works = await this.saveGroupAndUser(group, userModel)
    if (works) {
      response = {
        status: ResponseStatus.OK,
        message: 'Group created succesfully'
      }
    } else {
      response = {
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        err: 'Error saving group'
      }
    }
    return response
  }

  private async saveGroupAndUser (group: GroupDocument, user: UserDocument): Promise<boolean> {
    let works = true
    try {
      await group.save()
      await user.save()
    } catch (err) {
      console.log(err)
      works = false
    }
    return works
  }

  private updateUserWhenCreateGroup (user: UserDocument, group: GroupDocument): void {
    const grupParams: UserGroup = {
      groupId: new mongoose.Types.ObjectId(group?._id),
      groupName: group.info.name,
      role: 'member' as Role,
      date: new Date(now())
    }
    // add to user groups
    user.groups?.push(grupParams)
  }

  private createGroupModel (user: UserDocument, info: GroupInfo): GroupDocument {
    info.numberOfMembers = 1
    info.numberOfPublications = 0
    const members = [
      {
        userId: new mongoose.Types.ObjectId(user?._id),
        username: user?.username,
        name: user?.name,
        role: 'editor' as Role,
        state: 'active' as MemberState
      }
    ]
    // create group object
    const groupInfo: Group = {
      info,
      members,
      requests: [],
      page: []
    }
    // save group
    return new GroupModel(groupInfo)
  }
}

export default new CreateGroup()
