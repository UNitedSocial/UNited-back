import GroupModel from '../models/Group.model'
import { GroupDocument, Requests, RequestState } from '../models/group.documents'
import { Responses, ResponseStatus } from '../types/response.types'

class GetRequests {
  public async getRequests (groupname: string): Promise<Responses> {
    let response: Responses
    let group: GroupDocument | null = null
    const requests: Requests[] = []
    // Get groups
    try {
      group = await GroupModel.findOne({ 'info.name': groupname }, { _id: 0, __v: 0 })
    } catch {
      response = {
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        message: 'Error finding requests'
      }
    }
    if (group === null) {
      response = {
        status: ResponseStatus.NOT_FOUND,
        message: 'The Group doesn\'t exist'
      }
      return response
    }

    // Get Requests from group
    group.requests?.forEach((request) => {
      if (request.state === RequestState.pending) {
        requests.push(request)
      }
    })

    // Check if there are groups
    if (requests.length === 0) {
      response = {
        status: ResponseStatus.NOT_FOUND,
        message: 'The Group has no requests'
      }
    } else {
      response = {
        answer: requests,
        status: ResponseStatus.OK,
        message: 'Requests found successfully'
      }
    }

    return response
  }
}

export default new GetRequests()
