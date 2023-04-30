
import GroupModel from '../models/Group.model'
import { GroupDocument } from '../models/group.documents'
import { Responses, ResponseStatus } from '../models/response.documents'

class EditGroup {
  public async editGroup (_group: GroupDocument, groupname: string): Promise<Responses> {
    let response: Responses
    let groupDoc: GroupDocument | null

    // Get group and user data
    try {
      groupDoc = await GroupModel.findOne({ 'info.name': groupname })
    } catch {
      response = {
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        message: 'Error getting user or group'
      }
      return response
    }

    // Check if group and user exist
    if (groupDoc == null) {
      response = {
        status: ResponseStatus.NOT_FOUND,
        message: 'Group doesn\'t exist'
      }
      return response
    }

    response = {
      status: ResponseStatus.CREATED,
      message: 'Request created succesfully'
    }

    return response
  }
}

export default new EditGroup()
