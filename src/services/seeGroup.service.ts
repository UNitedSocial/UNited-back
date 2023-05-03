import GroupModel from '../models/Group.model'
import { GroupDocument } from '../models/group.documents'
import { Responses, ResponseStatus } from '../types/response.types'

class SeeGroup {
  public async seeGroup (groupname: string): Promise<Responses> {
    let response: Responses
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
    } else {
      response = {
        answer: group,
        status: ResponseStatus.OK,
        message: 'Group found successfully'
      }
    }

    return response
  }
}

export default new SeeGroup()
