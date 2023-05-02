import GroupModel from '../models/Group.model'
import { GroupDocument } from '../models/group.documents'
import { Responses, ResponseStatus } from '../models/response.documents'

class GetMembers {
  public async getMembers (groupname: string): Promise<Responses> {
    let response: Responses
    let members: GroupDocument[] = []
    // Get groups
    try {
      members = await GroupModel.find({ 'info.name': groupname }, { members: 1, _id: 0 })
    } catch {
      response = {
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        message: 'Error finding group'
      }
    }

    // Check if there are groups
    if (members.length === 0) {
      response = {
        status: ResponseStatus.NOT_FOUND,
        message: 'The Group doesn\'t exist'
      }
    } else {
      response = {
        answer: members,
        status: ResponseStatus.OK,
        message: 'Members found successfully'
      }
    }

    return response
  }
}

export default new GetMembers()
