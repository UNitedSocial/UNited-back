import { NextFunction, Request, Response } from 'express'
import { displayOptions } from '../config/defaultOptions.config'
import GroupModel from '../models/Group.model'
import { GroupInfo, groupSections } from '../models/group.documents'

import createGroupService from '../services/createGroup.service'
import getGroupsService from '../services/getGroups.service'
import seeGroupService from '../services/seeGroup.service'
import getMembersService from '../services/getMembers.service'
import changeRoleServices from '../services/changeRole.service'
import getNewService from '../services/getNew.service'
import getPopularService from '../services/getPopular.service'
import getRelatedService from '../services/getRelated.service'
import createSectionService from '../services/createSection.service'
import deleteSectionService from '../services/deleteSection.service'
import editSectionService from '../services/editSection.service'

class GroupsController {
  // Get all groups
  public async getGroups (req: Request, res: Response, _next: NextFunction): Promise<void> {
    // Get params or use default values for groups display
    const index = (req.query.n !== undefined) ? Number(req.query.n) : displayOptions.index.n
    const offset = (req.query.o !== undefined) ? Number(req.query.o) : displayOptions.index.offset
    // Get only the info field
    const response = await getGroupsService.getGroups(index, offset)
    console.log(response.message)
    res.status(response.status).send(response.answer)
  }

  // Get info of an specific group
  public async seeGroup (req: Request, res: Response, _next: NextFunction): Promise<void> {
    // Get groupname
    const groupname = req.params.groupname
    // Call service
    const response = await seeGroupService.seeGroup(groupname)
    console.log(response.message)
    res.status(response.status).send(response.answer)
  }

  // Get members of an specific group
  public async getMembers (req: Request, res: Response, _next: NextFunction): Promise<void> {
    // Get groupname
    const groupname = req.params.groupname
    // Call service
    const response = await getMembersService.getMembers(groupname)
    console.log(response.message)
    res.status(response.status).send(response.answer)
  }

  // Get most recent created groups
  public async getNew (req: Request, res: Response, _next: NextFunction): Promise<void> {
    // Get params or use default values for groups display
    const index = (req.query.n !== undefined) ? Number(req.query.n) : displayOptions.index.n
    const offset = (req.params.page !== undefined) ? Number(req.params.page) : displayOptions.index.offset
    // Call service
    const response = await getNewService.getNew(index, offset)
    console.log(response.message)
    res.status(response.status).send(response.answer)
  }

  // Get most popular groups
  public async getPopular (req: Request, res: Response, _next: NextFunction): Promise<void> {
    // Get params or use default values for groups display
    const index = (req.query.n !== undefined) ? Number(req.query.n) : displayOptions.index.n
    const offset = (req.params.page !== undefined) ? Number(req.params.page) : displayOptions.index.offset
    // Call service
    const response = await getPopularService.getPopular(index, offset)
    console.log(response.message)
    res.status(response.status).send(response.answer)
  }

  // Change role of a user in a group
  public async changeRole (req: Request, res: Response, _next: NextFunction): Promise<void> {
    // Get group and user data
    const { username, role } = req.body
    const groupname = req.params.groupname
    // Call service
    const response = await changeRoleServices.changeRole(username, groupname, role)
    console.log(response.message)
    res.status(response.status).send(response.answer)
  }

  // Create a section
  public async createSection (req: Request, res: Response, _next: NextFunction): Promise<void> {
    // Get group and user data
    const groupname = req.params.groupname
    const section: groupSections = req.body.section
    // Call service
    const response = await createSectionService.createSection(groupname, section)
    console.log(response.message)
    res.status(response.status).send(response.answer)
  }

  // Delete a section
  public async deleteSection (req: Request, res: Response, _next: NextFunction): Promise<void> {
    // Get group and user data
    const position = Number(req.body.position)
    const groupname = req.params.groupname
    // Call service
    const response = await deleteSectionService.deleteSection(groupname, position)
    console.log(response.message)
    res.status(response.status).send(response.answer)
  }

  // Edit a section
  public async editSection (req: Request, res: Response, _next: NextFunction): Promise<void> {
    // Get group and user data
    const { username/* , role */ } = req.body
    const groupname = req.params.groupname
    // Call service
    const response = await editSectionService.editSection(username, groupname)
    console.log(response.message)
    res.status(response.status).send(response.answer)
  }

  // Refactor pending
  // Create new group
  public async createGroup (req: Request, res: Response, _next: NextFunction): Promise<void> {
    const { group, user } = req.body
    const username = user?.nickname
    // Get only the info field
    const info: GroupInfo = group.info
    const response = await createGroupService.createGroup(info, username)
    if (response.status === 200) {
      res.status(response.status).send(group)
    } else {
      res.status(response.status).send({
        err: response.err,
        message: response.message
      })
    }
  }

  // Function for getting related groups
  public async getRelated (req: Request, res: Response, _next: NextFunction): Promise<void> {
    // Get params or use default values for groups display
    const n = (req.query.n !== undefined) ? Number(req.query.n) : displayOptions.related.n
    const offset = (req.query.a !== undefined) ? Number(req.query.a) : displayOptions.related.offset
    const groupname = req.params.groupname
    // Get group topics
    const group = await GroupModel.findOne({ 'info.name': groupname }, 'info.topics', { _id: 0, __v: 0 })
    const topics = group?.info.topics
    if (topics === undefined) {
      res.status(404).send({ err: 'Group not found' })
      return
    }

    // Get related groups
    const related = await getRelatedService.getRelated(topics, groupname, n, offset).catch((err): void => {
      console.log('Error getting related groups', err.message)
      res.status(500).send({ err })
    })
    // Send response
    res.status(200).send(related)
  }
}

export default new GroupsController()
