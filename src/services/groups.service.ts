import GroupModel from '../models/Group.model'

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

  public async getGroupRole (_groupName: string, _username: string): Promise<string> {
    return 'admin'
  }
}

export default new GroupService()
