import GroupModel from '../models/Group.model'
import { GroupDocument } from '../models/group.documents'
import UserModel from '../models/User.model'
import { UserDocument } from '../models/user.documents'
import { Responses, ResponseStatus } from '../types/response.types'
import requestsServices from '../services/requests.service'
class DeleteUser {
  public async deleteUser (username: string): Promise<Responses> {
    let response: Responses
    let group: GroupDocument [] = []
    let user: UserDocument | null = null

    // Get group
    try {
      user = await UserModel.findOne({ username }, { _id: 0, __v: 0 })
    } catch {
      response = {
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        message: 'Error finding user'
      }
      return response
    }

    // Get group
    try {
      group = await GroupModel.find({ 'members.username': username }, { _id: 0, __v: 0 })
    } catch {
      response = {
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        message: 'Error finding group'
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

    // Delete the user from the group
    try {
      for (let i = 0; i < group.length; i++) {
        if (!requestsServices.userIsInGroup(user, group[i])) {
          response = {
            status: ResponseStatus.BAD_REQUEST,
            message: 'User isn\'t in the group'
          }
          return response
        }
        group[i].members.forEach((member) => {
          if (member.username === username) {
            console.log(group[i]?.members.indexOf(member))
            group[i]?.members.splice(group[i]?.members.indexOf(member), 1)
          }
        })

        const usergroups = group[i].members
        const nuevoValor = group[i].info.numberOfMembers - 1
        await GroupModel.updateOne(
          { 'members.username': username },
          {
            members: usergroups,
            'info.numberOfMembers': nuevoValor
          }
        )
      }
    } catch {
      response = {
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        message: 'Error deleting group from user'
      }
      return response
    }
    // Delete the USER
    try {
      await UserModel.deleteOne({ username })
    } catch {
      response = {
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        message: 'Error deleting user'
      }
      return response
    }

    response = {
      status: ResponseStatus.OK,
      message: 'User deleted successfully'
    }

    return response
  }
}

export default new DeleteUser()
