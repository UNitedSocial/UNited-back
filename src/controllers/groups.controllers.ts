import { NextFunction, Request, Response } from 'express'
import { displayOptions } from '../config/defaultOptions.config'
import GroupModel from '../models/Group.model'

import createGroupService from '../services/createGroup.service'
import getGroupsService from '../services/getGroups.service'
import seeGroupService from '../services/seeGroup.service'
import editGroupService from '../services/editGroup.service'
import getMembersService from '../services/getMembers.service'
import changeRoleServices from '../services/changeRole.service'
import quitGroupService from '../services/quitGroup.service'
import getRelatedService from '../services/getRelated.service'
import getNewService from '../services/getNew.service'
import getPopularService from '../services/getPopular.service'
import createSectionService from '../services/createSection.service'
import deleteSectionService from '../services/deleteSection.service'
import editSectionService from '../services/editSection.service'

class GroupsController {
  // Create new group
  public async createGroup (req: Request, res: Response, _next: NextFunction): Promise<void> {
    // Get group and user data
    const { group, user } = req.body
    // Call service
    const response = await createGroupService.createGroup(group, user.username)
    console.log(response.message)
    res.status(response.status).send(response.answer)
  }

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

  // Edit info of an specific group
  public async editGroup (req: Request, res: Response, _next: NextFunction): Promise<void> {
    // Get groupname and group data
    const groupname = req.params.groupname
    const group = req.body.group
    // Call service
    const response = await editGroupService.editGroup(groupname, group)
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

  // Change role of a user in a group
  public async changeRole (req: Request, res: Response, _next: NextFunction): Promise<void> {
    // Get group and user data
    const groupname = req.params.groupname
    const { username, role } = req.body
    // Call service
    const response = await changeRoleServices.changeRole(groupname, username, role)
    console.log(response.message)
    res.status(response.status).send(response.answer)
  }

  // Quit a group
  public async quitGroup (req: Request, res: Response, _next: NextFunction): Promise<void> {
    // Get username
    const groupname = req.params.groupname
    const { user } = req.body
    // Call service
    const response = await quitGroupService.quitGroup(groupname, user.username)
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

  // Create a section
  public async createSection (req: Request, res: Response, _next: NextFunction): Promise<void> {
    // Get group and user data
    const groupname = req.params.groupname
    const section = req.body.section
    // Call service
    const response = await createSectionService.createSection(groupname, section)
    console.log(response.message)
    res.status(response.status).send(response.answer)
  }

  // Delete a section
  public async deleteSection (req: Request, res: Response, _next: NextFunction): Promise<void> {
    // Get group and user data
    const groupname = req.params.groupname
    const position = Number(req.body.position)
    // Call service
    const response = await deleteSectionService.deleteSection(groupname, position)
    console.log(response.message)
    res.status(response.status).send(response.answer)
  }

  // Edit a section
  public async editSection (req: Request, res: Response, _next: NextFunction): Promise<void> {
    // Get group and user data
    const groupname = req.params.groupname
    const position = Number(req.body.position)
    const section = req.body.section
    // Call service
    const response = await editSectionService.editSection(groupname, position, section)
    console.log(response.message)
    res.status(response.status).send(response.answer)
  }

  // Refactor pending
  // Function for getting related groups
  public async getRelated (req: Request, res: Response, _next: NextFunction): Promise<void> {
    // Get params or use default values for groups display
    const n = (req.query.n !== undefined) ? Number(req.query.n) : displayOptions.index.n
    const offset = (req.query.a !== undefined) ? Number(req.query.a) : displayOptions.index.offset
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
