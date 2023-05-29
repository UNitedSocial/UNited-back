import GroupModel from '../models/Group.model'
import { GroupDocument } from '../models/group.documents'
import { Responses, ResponseStatus } from '../types/response.types'

class GetGroups {
  public async getGroups (index: number, offset: number): Promise<Responses> {
    let response: Responses
    let groups: GroupDocument[] = []

    // Get groups
    try {
      groups = await GroupModel.find({}, { info: 1, _id: 0 }, { skip: offset, limit: index })
    } catch {
      response = {
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        message: 'Error finding groups'
      }
    }

    // Check if there are groups
    if (groups.length === 0) {
      response = {
        answer: groups,
        status: ResponseStatus.OK,
        message: 'There are no groups to show'
      }
    } else {
      response = {
        answer: groups,
        status: ResponseStatus.OK,
        message: 'Groups found successfully'
      }
    }

    return response
  }
}

export default new GetGroups()
