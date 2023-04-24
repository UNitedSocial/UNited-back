import mongoose, { now } from 'mongoose'
import UserModel from '../models/User.model'
import GroupModel from '../models/Group.model'
import { UserDocument, RequestUser, UserGroup } from '../models/user.documents'
import { GroupDocument, RequestState, Requests, Role } from '../models/group.documents'

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

  public createRequestObjects (user: UserDocument, group: GroupDocument): { requestUser: RequestUser, requestGroup: Requests } {
    // create request object for user and for group
    const date: Date = new Date(now())
    const requestUser: RequestUser = {
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

  public async changeRole (userRequest: string, groupname: string, role: Role): Promise<boolean> {
    const user: UserDocument | null = await UserModel.findOne({ username: userRequest })
      .catch((err): null => {
        console.log('Error finding user', err.message)
        return null
      })
    const group: GroupDocument | null = await GroupModel.findOne({ 'info.name': groupname })
      .catch((err): null => {
        console.log('Error finding user', err.message)
        return null
      })
    if (user == null || group == null) {
      return false
    }
    // get the user and the group to change in each diferent model
    group.members.forEach(member => {
      if (member.username === user.username) {
        console.log('member after', member)
        member.role = role
        console.log('member before', member)
      }
    })
    user.groups.forEach((group: UserGroup) => {
      if (group.groupName === groupname) {
        console.log('group after', group)
        group.role = role
        console.log('group before', group)
      }
    })
    // save the changes
    let works: boolean = true
    await group.save()
      .catch((err): void => {
        console.log('Error saving group', err.message)
        works = false
      })
    await user.save()
      .catch((err): void => {
        console.log('Error saving group', err.message)
        works = false
      })
    return works
  }
}

export default new RequestService()
