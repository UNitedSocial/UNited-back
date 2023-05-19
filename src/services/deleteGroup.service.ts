import GroupModel from '../models/Group.model'
import { GroupDocument } from '../models/group.documents'
import UserModel from '../models/User.model'
import { UserDocument } from '../models/user.documents'
import { Responses, ResponseStatus } from '../types/response.types'
import requestsServices from '../services/requests.service'
class DeleteGroup {
  public async deleteGroup (groupname: string): Promise<Responses> {
    let response: Responses
    let group: GroupDocument | null = null
    let user: UserDocument [] = []

    // Get group
    try {
      group = await GroupModel.findOne({ 'info.name': groupname }, { _id: 0, __v: 0 })
    } catch {
      response = {
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        message: 'Error finding group'
      }
      return response
    }

    // Get group
    try {
      user = await UserModel.find({ 'groups.groupName': groupname }, { _id: 0, __v: 0 })
    } catch {
      response = {
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        message: 'Error finding user'
      }
      return response
    }
    // Check if group and user exists
    if (group === null || user === null) {
      response = {
        status: ResponseStatus.NOT_FOUND,
        message: 'The Group or User doesn\'t exist'
      }
      return response
    }

    // Delete the group from the user
    try {
      for (let i = 0; i < user.length; i++) {
        if (!requestsServices.userIsInGroup(user[i], group)) {
          response = {
            status: ResponseStatus.BAD_REQUEST,
            message: 'User isn\'t in the group'
          }
          return response
        }
        user[i]?.groups.forEach((group) => {
          if (group.groupName === groupname) {
            user[i]?.groups.splice(user[i]?.groups.indexOf(group), 1)
          }
        })

        const usergroups = user[i].groups
        await UserModel.updateOne({ 'groups.groupName': groupname }, { groups: usergroups })
      }
    } catch {
      response = {
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        message: 'Error deleting group from user'
      }
      return response
    }
    // Delete the group
    try {
      await GroupModel.deleteOne({ 'info.name': groupname })
    } catch {
      response = {
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        message: 'Error deleting group'
      }
      return response
    }

    response = {
      status: ResponseStatus.OK,
      message: 'Group deleted successfully'
    }

    return response
  }
}

export default new DeleteGroup()
