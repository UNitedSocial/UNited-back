import { SortOrder } from 'mongoose'
import GroupModel from '../models/Group.model'
import { GroupDocument } from '../models/group.documents'
import { Responses, ResponseStatus } from '../types/response.types'

class SearchGroups {
  public async searchGroups (query: string, order: string, descending: string, filter: string, value: string): Promise<Responses> {
    let response: Responses
    let groups: GroupDocument[] = []

    // Convert query to RegExp
    const reg = new RegExp(query, 'i')
    // Order groups
    switch (order) {
      case 'date':
        order = 'info.creationDate'
        break
      case 'members':
        order = 'info.numberOfMembers'
        break
      case 'publications':
        order = 'info.numberOfPublications'
        break
      default:
        order = 'info.name'
        break
    }

    // Filter groups
    switch (filter) {
      case 'topics':
        filter = 'info.topics'
        if (value === '0') {
          filter = 'info.isRecognized'
          value = 'true-false'
        }
        break
      case 'classification':
        filter = 'info.clasification'
        if (value === '0') {
          filter = 'info.isRecognized'
          value = 'true-false'
        }
        break
      case 'members':
        filter = 'info.numberOfMembers'
        break
      case 'date':
        filter = 'info.creationDate'
        break
      case 'recognized':
        filter = 'info.isRecognized'
        if (value === '0') {
          filter = 'info.isRecognized'
          value = 'true-false'
        }
        break
      default:
        filter = 'info.isRecognized'
        value = 'true-false'
    }

    // Ascending or descending order
    let des: SortOrder = 1
    if (descending === 'yes') {
      des = -1
    }

    // Get groups
    if (filter === 'info.numberOfMembers' || filter === 'info.creationDate') {
      try {
        groups = await GroupModel.find({ $and: [{ 'info.name': { $regex: reg } }, { [filter]: { $gte: value } }] }, { info: 1, _id: 0 }).sort([[order, des]])
      } catch {
        response = {
          status: ResponseStatus.INTERNAL_SERVER_ERROR,
          message: 'Error finding groups'
        }
      }
    } else {
      const newValue: string[] = value.split('-')
      try {
        groups = await GroupModel.find({ $and: [{ 'info.name': { $regex: reg } }, { [filter]: { $in: newValue } }] }, { info: 1, _id: 0 }).sort([[order, des]])
      } catch {
        response = {
          status: ResponseStatus.INTERNAL_SERVER_ERROR,
          message: 'Error finding groups'
        }
      }
    }

    // Check if there are groups
    if (groups.length === 0) {
      response = {
        status: ResponseStatus.NOT_FOUND,
        message: 'There are no groups to show'
      }
    } else {
      response = {
        answer: groups,
        status: ResponseStatus.OK,
        message: 'Search found groups successfully'
      }
    }

    return response
  }
}

export default new SearchGroups()
