import GroupModel from '../models/Group.model'
import { GroupDocument } from '../models/group.documents'
import { Responses, ResponseStatus } from '../models/response.documents'

class GetPopular {
  public async getPopular (index: number, offset: number): Promise<Responses> {
    let response: Responses
    let popularGroups: GroupDocument[] = []
    // Get groups
    try {
      popularGroups = await GroupModel.find({}, { info: 1, _id: 0 }, { limit: index, skip: offset }).sort([['info.numberOfMembers', -1]])
    } catch {
      response = {
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        message: 'Error finding popular groups'
      }
    }

    // Check if there are groups
    if (popularGroups.length === 0) {
      response = {
        status: ResponseStatus.NOT_FOUND,
        message: 'There is any popular group to show'
      }
    } else {
      response = {
        answer: popularGroups,
        status: ResponseStatus.OK,
        message: 'Popular groups found successfully'
      }
    }

    return response
  }
}

export default new GetPopular()
