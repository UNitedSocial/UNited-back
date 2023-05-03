import GroupModel from '../models/Group.model'
import { GroupDocument } from '../models/group.documents'
import { Responses, ResponseStatus } from '../types/response.types'

class GetRelated {
  public async getRelated (groupname: string, index: number, offset: number): Promise<Responses> {
    let response: Responses
    let group: GroupDocument | null = null

    // Get groups
    try {
      group = await GroupModel.findOne({ 'info.name': groupname }, { 'info.topics': 1, _id: 0 }, { limit: index, skip: offset })
    } catch {
      response = {
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        message: 'Error finding group'
      }
    }

    // Check if there are groups
    if (group == null) {
      response = {
        status: ResponseStatus.NOT_FOUND,
        message: 'Group doesn\'t exist'
      }
    }
    console.log(group)
    response = {
      status: ResponseStatus.OK,
      message: 'Related groups found successfully'
    }

    return response
  }
}

export default new GetRelated()
