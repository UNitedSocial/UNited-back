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
  public async seeGroup (groupname: string): Promise<ResponseService> {
    let response: ResponseService
    let group: GroupDocument[] = []
    // Get groups
    try {
      group = await GroupModel.find({ 'info.name': groupname }, { _id: 0, __v: 0 })
    } catch {
      response = {
        answer: group,
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        message: 'Error finding group'
      }
    }

    // Check if there are groups
    if (group.length === 0) {
      response = {
        status: ResponseStatus.NOT_FOUND,
        message: 'The Group doesn\'t exist'
      }
    }
    response = {
      answer: group,
      status: ResponseStatus.OK,
      message: 'Group found successfully'
    }

    return response
  }
}

export default new GetGroups()
