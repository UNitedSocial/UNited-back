import mongoose from 'mongoose'
import GroupModel from '../models/Group.model'
import { GroupDocument } from '../models/group.documents'
import { Responses, ResponseStatus } from '../types/response.types'

class DeleteSection {
  public async deleteSection (groupname: string, position: number): Promise<Responses> {
    const session = await mongoose.startSession()
    let response: Responses
    let groupDoc: GroupDocument | null
    if (position === 0) {
      response = {
        status: ResponseStatus.BAD_REQUEST,
        message: 'Invalid position or missing position'
      }
      return response
    }
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

    // Delete section
    groupDoc.page.forEach((section) => {
      if (section.position === position) {
        groupDoc?.page.splice(position - 1, 1)
      }
    })

    // // Update positions
    groupDoc.page.forEach((section) => {
      if (section.position > position) {
        section.position -= 1
      }
    })

    // Save changes
    try {
      await session.startTransaction()
      await groupDoc.save()
      await session.commitTransaction()
    } catch {
      response = {
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        message: 'Error saving group'
      }
      await session.abortTransaction()
    }

    response = {
      status: ResponseStatus.CREATED,
      message: 'Section deleted successfully'
    }
    await session.endSession()

    return response
  }
}

export default new DeleteSection()
