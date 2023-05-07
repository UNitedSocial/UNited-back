import GroupModel from '../models/Group.model'
import { GroupDocument } from '../models/group.documents'
import { Responses, ResponseStatus } from '../types/response.types'

class DeleteGroup {
  public async deleteGroup (groupname: string): Promise<Responses> {
    let response: Responses
    let group: GroupDocument[] = []
    // Get groups
    try {
      group = await GroupModel.find({ 'info.name': groupname }, { _id: 0, __v: 0 })
    } catch {
      response = {
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        message: 'Error finding group'
      }
      return response
    }

    // Check if there are groups
    if (group.length === 0) {
      response = {
        status: ResponseStatus.NOT_FOUND,
        message: 'The Group doesn\'t exist'
      }
      return response
    }

    // Delete the group
    try {
      await GroupModel.deleteOne({ 'info.name': groupname })
    } catch {
      response = {
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        message: 'Error deleting group'
      }
      return response
    }

    response = {
      status: ResponseStatus.OK,
      message: 'Group deleted successfully'
    }

    return response
  }
}

export default new DeleteGroup()
