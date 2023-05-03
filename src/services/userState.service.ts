import UserModel from '../models/User.model'
import GroupModel from '../models/Group.model'
import { UserDocument } from '../models/user.documents'
import { GroupDocument } from '../models/group.documents'
import { Responses, ResponseStatus } from '../types/response.types'

class UserState {
  public async userState (groupname: string, username: string): Promise<Responses> {
    let response: Responses
    let userDoc: UserDocument | null = null
    let groupDoc: GroupDocument | null = null

    // Get groups
    try {
      userDoc = await UserModel.findOne({ username }, { _id: 0, __v: 0 })
      groupDoc = await GroupModel.findOne({ 'info.name': groupname }, { _id: 0, __v: 0 })
    } catch {
      response = {
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        message: 'Error finding user or group'
      }
    }

    // Check if group and user exist
    if (userDoc == null || groupDoc == null) {
      response = {
        status: ResponseStatus.NOT_FOUND,
        message: 'The User or group doesn\'t exist'
      }
      return response
    }

    // Default response if user doesn't belong to group
    let state = 'doesn\'t belong'
    response = {
      answer: state,
      status: ResponseStatus.OK,
      message: 'User doesn\'t belong to group'
    }

    // Check if user has pending request
    userDoc.requests.forEach(request => {
      if (request.groupName === groupname && request.state === 'pending') {
        state = 'pending'
        response = {
          answer: state,
          status: ResponseStatus.OK,
          message: 'Pending request'
        }
      }
    })

    // Check if user belongs to group
    groupDoc.members.forEach(member => {
      if (member.username === username) {
        state = 'belongs'
        response = {
          answer: state,
          status: ResponseStatus.OK,
          message: 'User belongs to group'
        }
      }
    })

    return response
  }
}

export default new UserState()
