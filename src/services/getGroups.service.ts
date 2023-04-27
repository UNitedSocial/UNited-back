import GroupModel from '../models/Group.model'
import { GroupDocument } from '../models/group.documents'

enum ResponseStatus {
  OK = 200,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500
}

interface ResponseService {
  status: ResponseStatus
  answer?: GroupDocument[]
  err?: string
  message?: string
}

class GetGroups {
  public async getGroups (n: number, offset: number): Promise<ResponseService> {
    let response: ResponseService
    let groups: GroupDocument[] = []
    // Get groups
    try {
      groups = await GroupModel.find({}, { info: 1, _id: 0 }, { skip: offset, limit: n })
    } catch {
      response = {
        answer: groups,
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        message: 'Error finding groups'
      }
    }

    // Check if there are groups
    if (groups.length === 0) {
      response = {
        status: ResponseStatus.NOT_FOUND,
        message: 'There are no groups to show'
      }
    }
    response = {
      answer: groups,
      status: ResponseStatus.OK,
      message: 'Groups found successfully'
    }

    return response
  }
}

export default new GetGroups()
