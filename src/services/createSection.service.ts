import GroupModel from '../models/Group.model'
import { GroupDocument, groupSections, SectionTypes } from '../models/group.documents'
import { Responses, ResponseStatus } from '../models/response.documents'

class CreateSection {
  public async createSection (groupname: string, section: groupSections): Promise<Responses> {
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

    // Check section properties
    if (section == null || section.type == null || section.content == null) {
      response = {
        status: ResponseStatus.BAD_REQUEST,
        message: 'Section wasn\'t sent or properties are missing'
      }
      return response
    }

    // Check section type
    if (section.type !== SectionTypes.carousel && section.type !== SectionTypes.list && section.type !== SectionTypes.paragraphs && section.type !== SectionTypes.subtitle && section.type !== SectionTypes.title) {
      response = {
        status: ResponseStatus.BAD_REQUEST,
        message: 'Section type doesn\'t exist'
      }
      return response
    }

    // Update group sections
    section.position = groupDoc.page.length + 1
    groupDoc.page.push(section)

    // Save changes
    try {
      await groupDoc.save()
    } catch {
      response = {
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        message: 'Error saving group'
      }
    }

    response = {
      status: ResponseStatus.CREATED,
      message: 'Section created successfully'
    }

    return response
  }
}

export default new CreateSection()
