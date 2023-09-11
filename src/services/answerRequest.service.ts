import mongoose, { now } from 'mongoose'
import UserModel from '../models/User.model'
import GroupModel from '../models/Group.model'
import { UserDocument } from '../models/user.documents'
import { GroupDocument, RequestState, Role, MemberState } from '../models/group.documents'
import { Responses, ResponseStatus } from '../types/response.types'

class AnswerRequest {
  public async answerRequest (groupname: string, username: string, answer: string): Promise<Responses> {
    const session = await mongoose.startSession()
    let response: Responses
    let groupDoc: GroupDocument | null
    let userDoc: UserDocument | null
    console.log(groupname, username, answer)

    // Check if answer is valid
    if (answer !== 'approved' && answer !== 'rejected') {
      response = {
        status: ResponseStatus.BAD_REQUEST,
        message: 'Answer is not valid'
      }
      return response
    }

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

    // Get only pending request in user and group
    const requestUser = userDoc?.requests.find(request => request?.groupName === groupname && request.state === RequestState.pending)
    const requestGroup = groupDoc?.requests.find(request => request.username === username && request.state === RequestState.pending)

    // Check if request exists
    if (requestUser == null || requestGroup == null) {
      response = {
        status: ResponseStatus.NOT_FOUND,
        message: 'Request doesn\'t exist'
      }
      return response
    }

    // Delete request from user and group
    userDoc.requests = userDoc.requests.filter(request => request?.groupName !== groupname || request.state !== RequestState.pending)
    groupDoc.requests = groupDoc.requests.filter(request => request?.username !== username || request.state !== RequestState.pending)

    // Check value of answer
    if (answer === 'rejected') {
      // Delete request from user and group
      requestGroup.state = RequestState.rejected
      groupDoc.requests.push(requestGroup)
      requestUser.state = RequestState.rejected
      userDoc.requests.push(requestUser)
    } else {
      // Add member to group
      groupDoc.members.push({
        userId: new mongoose.Types.ObjectId(userDoc._id),
        username: userDoc.username,
        name: userDoc.name,
        role: 'member' as Role,
        state: 'active' as MemberState
      })
      // Add group to user
      userDoc.groups.push({
        groupId: new mongoose.Types.ObjectId(groupDoc?._id),
        groupName: groupDoc.info.name,
        role: 'member' as Role,
        date: new Date(now())
      })
      requestGroup.state = RequestState.approved
      groupDoc.requests.push(requestGroup)
      requestUser.state = RequestState.approved
      userDoc.requests.push(requestUser)
    }

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
      message: 'Request answered succesfully'
    }
    await session.endSession()

    return response
  }
}

export default new AnswerRequest()
