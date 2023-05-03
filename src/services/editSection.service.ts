import GroupModel from '../models/Group.model'
import { GroupDocument, groupSections } from '../models/group.documents'
import { Responses, ResponseStatus } from '../types/response.types'

class EditSection {
  public async editSection (groupname: string, position: number, section: groupSections): Promise<Responses> {
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

    // Check if position is valid
    if (position == null || isNaN(position) || position < 1 || position > groupDoc.page.length) {
      response = {
        status: ResponseStatus.BAD_REQUEST,
        message: 'Invalid position or missing position'
      }
      return response
    }

    // Edit section
    groupDoc.page.forEach((sec) => {
      if (sec.position === position) {
        sec.content = section.content
      }
    })

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
      message: 'Section updated successfully'
    }

    return response
  }
}

export default new EditSection()
