import { NextFunction, Request, Response } from 'express'
import { Group, GroupDocument, MemberState, Role } from '../models/group.documents'
import GroupModel from '../models/Group.model'
import mongoose from 'mongoose'
import { groupsRoutesOptions } from '../config/defaultOptions'
import UserModel from '../models/User.model'
import { UserDocument } from '../models/user.documents'

class GroupsController {
  // main page of the API
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
    // close connection
    await mongoose.connection.close().catch((err): void => {
      console.log('Error, closing connection', err.message)
    })
    console.log('Connection closed')
  }

  public async createGroup (req: Request, res: Response, _next: NextFunction): Promise<void> {
    // get only the info field
    const { group, username } = req.body
    const info = group.info
    // get user by username
    const user = await UserModel.findOne({ username }) as UserDocument
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
    const newGroup: GroupDocument = new GroupModel(groupInfo)
    let fine = true
    // save group
    await newGroup.save()
      .then((): void => {
        console.log('Guardando grupo')
      })
      // if error, send error and stop
      .catch((err): void => {
        res.status(500).json({ err })
        console.log('Error saving group', err.message)
        fine = false
      })
    // if all is fine, send ok message
    if (fine) {
      res.status(201)
    }
    // close connection
    await mongoose.connection.close().catch((err): void => {
      console.log('Error, closing connection', err.message)
    })
    console.log('Connection closed')
  }

  // test route
  public async doomie (req: Request, res: Response, _next: NextFunction): Promise<void> {
    const n = req.query.n
    const offset = req.query.a
    console.log(n, offset)
    res.status(200).json({ n, offset })
  }
}

export default new GroupsController()
