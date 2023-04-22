import { NextFunction, Request, Response } from 'express'
import { Group, GroupDocument, GroupInfo, MemberState, Role } from '../models/group.documents'
import GroupModel from '../models/Group.model'
import mongoose, { now } from 'mongoose'
import { groupsRoutesOptions } from '../config/defaultOptions'
import UserModel from '../models/User.model'
import { UserDocument, UserGroup } from '../models/user.documents'
import relatedService from '../services/related.service'

class GroupsController {
  // Get all groups info
  public async getGroups (req: Request, res: Response, _next: NextFunction): Promise<void> {
    // Get params or use default values for groups display
    const n = (req.query.n !== undefined) ? Number(req.query.n) : groupsRoutesOptions.index.n
    const offset = (req.query.a !== undefined) ? Number(req.query.a) : groupsRoutesOptions.index.offset
    // Get groups
    await GroupModel.find({}, { _id: 0, __v: 0 }, { skip: offset, limit: n })
      .then((groups: GroupDocument[]) => {
        // Check if there are groups to show
        if (groups.length === 0) {
          res.status(404).send({ err: 'There are no groups to show' })
          return
        }
        console.log('Groups found successfully')
        res.status(200).json(groups)
      })
      // If error, send error and stop
      .catch((err): void => {
        res.status(500).send(err)
        console.log('Error getting groups', err.message)
      })
  }

  // TODO: refactor this function (split in smaller functions)[use services folder]
  // Create new group
  public async createGroup (req: Request, res: Response, _next: NextFunction): Promise<void> {
    // get only the info field
    const { group, user } = req.body
    const username = user?.nickname
    const info: GroupInfo = group.info
    // get user by username
    const userModel = await UserModel.findOne({ username }) as UserDocument
    // create user info to save on group
    info.numberOfMembers = 1
    const members = [
      {
        userId: new mongoose.Types.ObjectId(userModel?._id),
        username: userModel?.username,
        name: userModel?.name,
        role: 'editor' as Role,
        state: 'active' as MemberState
      }
    ]
    // create group object
    const groupInfo: Group = {
      info,
      members,
      requests: [],
      page: []
    }
    // save group
    const newGroup: GroupDocument = new GroupModel(groupInfo)
    await newGroup.save()
    // save group info on user
      .then((savedGrop: GroupDocument): void => {
        // create user group info with saved group info
        const grupParams: UserGroup = {
          groupId: new mongoose.Types.ObjectId(savedGrop?._id),
          groupName: savedGrop.info.name,
          role: 'member' as Role,
          date: new Date(now())
        }
        // add to user groups
        userModel.groups?.push(grupParams)
        // save user
        userModel.save().catch((err): void => {
          console.log('Error saving user', err.message)
        })
        res.status(201).send({ message: 'Group created succesfully' })
        console.log('Group "' + savedGrop.info.name + '" saved and user "' + userModel.username + '" updated')
      })
      // if error, send error and stop
      .catch((err): void => {
        res.status(500).json({ err })
        console.log('Error saving group', err.message)
      })
  }

  // Get info of an specific group
  public async groupInfo (req: Request, res: Response, _next: NextFunction): Promise<void> {
    const groupname = req.params.groupname
    await GroupModel.find({ 'info.name': groupname }, 'info page', { __v: 0 })
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

  public async new (_req: Request, _res: Response, _next: NextFunction): Promise<void> {
  }

  public async related (req: Request, res: Response, _next: NextFunction): Promise<void> {
    // Get params or use default values for groups display
    const n = (req.query.n !== undefined) ? Number(req.query.n) : groupsRoutesOptions.related.n
    const offset = (req.query.a !== undefined) ? Number(req.query.a) : groupsRoutesOptions.related.offset
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

  // Test route
  public async doomie (req: Request, res: Response, _next: NextFunction): Promise<void> {
    const n = req.query.n
    const offset = req.query.a
    console.log(n, offset)
    res.status(200).json({ n, offset })
  }
}

export default new GroupsController()
