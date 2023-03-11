import { NextFunction, Request, Response } from 'express'
import { Group, GroupDocument } from '../models/group.documents'
import GroupModel from '../models/Group.model'
import mongoose from 'mongoose'
import { groupsRoutesOptions } from '../config/defaultOptions'

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
    // get group from body
    const group = req.body
    // create new group
    const newGroup: GroupDocument = new GroupModel(group as Group)
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
