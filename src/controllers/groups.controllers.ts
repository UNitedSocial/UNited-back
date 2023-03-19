import { NextFunction, Request, Response } from 'express'
import { Group, GroupDocument, GroupInfo, MemberState, Role } from '../models/group.documents'
import GroupModel from '../models/Group.model'
import mongoose, { now } from 'mongoose'
import { groupsRoutesOptions } from '../config/defaultOptions'
import UserModel from '../models/User.model'
import { UserDocument, UserGroup } from '../models/user.documents'

class GroupsController {
  // Get all groups info
  public async index (req: Request, res: Response, _next: NextFunction): Promise<void> {
    // get params or use default values
    const n = req.query.n !== undefined ? Number(req.query.n) : groupsRoutesOptions.index.n
    const offset = req.query.a !== undefined ? Number(req.query.a) : groupsRoutesOptions.index.offset
    // get groups
    await GroupModel.find({}, null, { skip: offset, limit: n })
      .then((groups: GroupDocument[]) => {
        // select only the info field
        const infoGroups = groups.map((group: GroupDocument) => {
          return {
            info: group.info
          }
        })
        // send the query result
        res.status(200).json(infoGroups)
      })
      // if error, send error and stop
      .catch((err): void => {
        res.status(500).json({ err })
        console.log('Error getting groups', err.message)
      })
  }

  // TODO: refactor this function (split in smaller functions)[use services folder]
  // Create new group
  public async createGroup (req: Request, res: Response, _next: NextFunction): Promise<void> {
    // get only the info field
    const { group, username } = req.body
    const info: GroupInfo = group.info
    // get user by username
    const user = await UserModel.findOne({ username }) as UserDocument
    // create user info to save on group
    info.numberOfMembers = 1
    const members = [
      {
        userId: new mongoose.Types.ObjectId(user?._id),
        username: user?.username,
        name: user?.name,
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
        user.groups?.push(grupParams)
        // save user
        user.save().catch((err): void => {
          console.log('Error saving user', err.message)
        })
        res.status(201)
        console.log('Group saved and user updated')
      })
      // if error, send error and stop
      .catch((err): void => {
        res.status(500).json({ err })
        console.log('Error saving group', err.message)
      })
  }

  // Get info of an specific group
  public async group (req: Request, res: Response, _next: NextFunction): Promise<void> {
    const groupname = req.params.groupname
    const group = await GroupModel.find({ groupname })
    const infoGroup = group.map((group: GroupDocument) => {
      return {
        Info: group.info
      }
    })
    res.send(infoGroup)
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
