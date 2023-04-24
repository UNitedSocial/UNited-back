import GroupModel from '../models/Group.model'
import { Member } from '../models/group.documents'

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
}

export default new GroupService()
