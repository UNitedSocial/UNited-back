import GroupModel from '../models/Group.model'
import { GroupDocument } from '../models/group.documents'
import { Responses, ResponseStatus } from '../types/response.types'

class GetNew {
  public async getNew (index: number, offset: number): Promise<Responses> {
    let response: Responses
    let newGroups: GroupDocument[] = []
    // Get groups
    try {
      newGroups = await GroupModel.find({}, { info: 1, _id: 0 }, { limit: index, skip: offset }).sort([['info.creationDate', -1]])
    } catch {
      response = {
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        message: 'Error finding new groups'
      }
    }

    // Check if there are groups
    if (newGroups.length === 0) {
      response = {
        status: ResponseStatus.NOT_FOUND,
        message: 'There is any new group to show'
      }
    } else {
      response = {
        answer: newGroups,
        status: ResponseStatus.OK,
        message: 'New groups found successfully'
      }
    }

    return response
  }
}

export default new GetNew()
