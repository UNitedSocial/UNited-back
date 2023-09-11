import mongoose from 'mongoose'
import GroupModel from '../models/Group.model'
import { GroupDocument } from '../models/group.documents'
import { Responses, ResponseStatus } from '../types/response.types'

class EditGroup {
  public async editGroup (groupname: string, group: GroupDocument): Promise<Responses> {
    const session = await mongoose.startSession()
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
      await session.startTransaction()
      await groupDoc.save()
      await session.commitTransaction()
    } catch {
      response = {
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        message: 'Error saving group'
      }
      await session.abortTransaction()
      return response
    }

    response = {
      answer: groupDoc,
      status: ResponseStatus.OK,
      message: 'Group updated succesfully'
    }
    await session.endSession()

    return response
  }
}

export default new EditGroup()
