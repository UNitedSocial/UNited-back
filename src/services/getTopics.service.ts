import GroupModel from '../models/Group.model'
import { GroupDocument } from '../models/group.documents'
import { Responses, ResponseStatus } from '../types/response.types'

class GetTopics {
  public async getTopics (groupname: string): Promise<Responses> {
    let response: Responses
    let topics: GroupDocument[] = []

    // Get groups
    try {
      topics = await GroupModel.find({ 'info.name': groupname }, { 'info.topics': 1, _id: 0 })
    } catch {
      response = {
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        message: 'Error finding group'
      }
    }

    // Check if there are groups
    if (topics.length === 0) {
      response = {
        status: ResponseStatus.NOT_FOUND,
        message: 'The Group doesn\'t exist'
      }
    } else {
      response = {
        answer: topics,
        status: ResponseStatus.OK,
        message: 'Topics found successfully'
      }
    }

    return response
  }
}

export default new GetTopics()
