import { NextFunction, Request, Response } from 'express'
import { displayOptions } from '../config/defaultOptions.config'
import GroupModel from '../models/Group.model'
import { GroupDocument, GroupInfo } from '../models/group.documents'

import relatedService from '../services/related.service'
import createGroupService from '../services/createGroup.service'
import getGroupsService from '../services/getGroups.service'
import seeGroupService from '../services/seeGroup.service'

class GroupsController {
  // Get all groups
  public async getGroups (req: Request, res: Response, _next: NextFunction): Promise<void> {
    // Get params or use default values for groups display
    const n = (req.query.n !== undefined) ? Number(req.query.n) : displayOptions.index.n
    const offset = (req.query.a !== undefined) ? Number(req.query.a) : displayOptions.index.offset
    // Get only the info field
    const response = await getGroupsService.getGroups(n, offset)
    console.log(response.message)
    res.status(response.status).send(response.answer)
  }

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

  // Get info of an specific group
  public async seeGroup (req: Request, res: Response, _next: NextFunction): Promise<void> {
    // Get params or use default values for groups display
    const groupname = req.params.groupname
    // Get only the info field
    const response = await seeGroupService.seeGroup(groupname)
    console.log(response.message)
    res.status(response.status).send(response.answer)
  }

  // Refactor pending
  // Get members of an specific group
  public async members (req: Request, res: Response, _next: NextFunction): Promise<void> {
    const groupname = req.params.groupname
    await GroupModel.find({ 'info.name': groupname }, 'members', { _id: 0 })
      .then((group: GroupDocument[]) => {
        if (group.length === 0) {
          res.status(404).send({ err: 'Group not found' })
          return
        }
        res.status(200)
        res.send(group)
      })
      .catch((err): void => {
        res.status(500).send({ err })
        console.log('Error finding group', err.message)
      })
  }

  // Function for getting new groups
  public async new (req: Request, res: Response, _next: NextFunction): Promise<void> {
    const ind = req.query.ind

    if (typeof ind === 'string') {
      const ind2: number = parseInt(ind)
      await GroupModel.find().sort([['info.creationDate', -1]]).limit(ind2)
        .then((group: GroupDocument[]) => {
          if (group.length === 0) {
            res.status(404).send({ err: 'Group not found' })
            return
          }
          res.status(200)
          res.send(group)
        })
        .catch((err): void => {
          res.status(500).send({ err })
          console.log('Error finding group', err.message)
        })
    } else {
      res.status(400).send({ err: 'Invalid ind parameter' })
    }
  }

  // Function for getting most popular groups
  public async popular (_req: Request, res: Response, _next: NextFunction): Promise<void> {
    await GroupModel.find().sort([['info.numberOfMembers', -1]]).limit(5)
      .then((group: GroupDocument[]) => {
        if (group.length === 0) {
          res.status(404).send({ err: 'Group not found' })
          return
        }
        res.status(200)
        res.send(group)
      })
      .catch((err): void => {
        res.status(500).send({ err })
        console.log('Error finding group', err.message)
      })
  }

  // Function for getting related groups
  public async related (req: Request, res: Response, _next: NextFunction): Promise<void> {
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
    const related = await relatedService.getBestRelatedGroups(topics, groupname, n, offset).catch((err): void => {
      console.log('Error getting related groups', err.message)
      res.status(500).send({ err })
    })
    // Send response
    res.status(200).send(related)
  }
}

export default new GroupsController()
