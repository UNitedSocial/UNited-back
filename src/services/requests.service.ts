
import { GroupDocument, RequestState, Requests } from '../models/group.documents'
import mongoose, { now } from 'mongoose'
import { UserDocument, requestUser } from '../models/user.documents'
class RequestService {
  private static userIsInGroup (user: UserDocument, group: GroupDocument): boolean {
    // check if the user is in the group
    let userInGroup: boolean = false
    group?.members.forEach(member => {
      if (member.username === user?.username) {
        userInGroup = true
      }
    })
    return userInGroup
  }

  private static userHasActiveRequest (user: UserDocument, group: GroupDocument): boolean {
    // check if the user has an active request
    let activeRequest: boolean = false
    group?.requests.forEach(request => {
      if (request.username === user?.username && request.state === RequestState.pending) {
        activeRequest = true
      }
    })
    return activeRequest
  }

  public createRequestObjects (user: UserDocument, group: GroupDocument): { requestUser: requestUser, requestGroup: Requests } {
    // create request object for user and for group
    const date: Date = new Date(now())
    const requestUser: requestUser = {
      groupId: new mongoose.Types.ObjectId(group._id),
      groupName: group.info.name,
      date,
      state: RequestState.pending
    }
    const requestGroup: Requests = {
      userId: new mongoose.Types.ObjectId(user._id),
      username: user.username,
      name: user.name,
      date,
      state: RequestState.pending
    }
    return { requestUser, requestGroup }
  }

  public validateUserRequest (user: UserDocument, group: GroupDocument): boolean {
    // check if the user is in the group
    if (RequestService.userIsInGroup(user, group)) {
      return false
    }
    // check if the user has an active request
    if (RequestService.userHasActiveRequest(user, group)) {
      return false
    }
    return true
  }
}

export default new RequestService()
