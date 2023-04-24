import GroupModel from '../models/Group.model'
import { GroupInfo, Member, GroupDocument, Role, MemberState, Group } from '../models/group.documents'
import UserModel from '../models/User.model'
import { UserDocument, UserGroup } from '../models/user.documents'
import mongoose, { now } from 'mongoose'

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
class GroupService {
  public async groupExists (groupName: string): Promise<boolean> {
    // check if group exist
    const group = await GroupModel.findOne({ 'info.name': groupName })
      .catch((err) => {
        console.log(err)
        return false
      })
    console.log(group)
    if (group != null) {
      return true
    } else {
      return false
    }
  }

  public async getGroupRole (groupName: string, _username: string): Promise<string | null> {
    let role: String | null = null
    const groupMembers: Member[] | null | String = await GroupModel.findOne({ 'info.name': groupName }, 'members')
      .then((group) => {
        if (group != null) {
          return group.members
        } else {
          return null
        }
      })
      .catch((err) => {
        console.log(err)
        return role
      })
    if (groupMembers === null || typeof groupMembers === 'string' || groupMembers instanceof String) {
      return role
    }
    groupMembers?.forEach((member) => {
      if (member.username === _username) {
        role = member.role
      }
    })
    if (role === null) {
      return 'not belongs'
    }
    return role
  }

  public async createGroup (info: GroupInfo, username: string): Promise<ResponseService> {
    const exist = await this.groupExists(info.name)
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

export default new GroupService()
