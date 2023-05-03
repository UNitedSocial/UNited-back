
import GroupModel from '../models/Group.model'
import { GroupDocument } from '../models/group.documents'
import { Responses, ResponseStatus } from '../types/response.types'

class EditGroup {
  public async editGroup (groupname: string, group: GroupDocument): Promise<Responses> {
    let response: Responses
    let groupDoc: GroupDocument | null

    // Get group data
    try {
      groupDoc = await GroupModel.findOne({ 'info.name': groupname })
    } catch {
      response = {
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        message: 'Error getting group'
      }
      return response
    }

    // Check if group exist
    if (groupDoc == null) {
      response = {
        status: ResponseStatus.NOT_FOUND,
        message: 'Group doesn\'t exist'
      }
      return response
    }

    // Edit group
    groupDoc.info = group.info

    // Save changes
    try {
      await groupDoc.save()
    } catch {
      response = {
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        message: 'Error saving group'
      }
      return response
    }

    response = {
      status: ResponseStatus.OK,
      message: 'Group updated succesfully'
    }

    return response
  }
}

export default new EditGroup()
