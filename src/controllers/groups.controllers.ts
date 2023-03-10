import { NextFunction, Request, Response } from 'express'
import { Group, GroupDocument } from '../models/group.documents'
import GroupModel from '../models/Group.model'
import mongoose from 'mongoose'

class GroupsController {
  public async index (_req: Request, res: Response, _next: NextFunction): Promise<void> {
    const groups = await GroupModel.find({}).catch((err): void => {
      res.status(500).json({ err })
    })
    res.status(200).json(groups)
    await mongoose.connection.close().catch((err): void => {
      console.log('Error closing connection', err.message)
    })
    console.log('Connection closed')
  }

  public async createGroup (req: Request, res: Response, _next: NextFunction): Promise<void> {
    const { group } = req.body
    const newGroup: GroupDocument = new GroupModel(group as Group)
    let fine = true
    await newGroup.save().then((): void => {
      console.log('Guardando grupo')
    }).catch((err): void => {
      res.status(500).json({ err })
      console.log('Error saving group', err.message)
      fine = false
    })
    if (fine) {
      res.status(201)
    }
    await mongoose.connection.close().catch((err): void => {
      console.log('Error closing connection', err.message)
    })
    console.log('Connection closed')
  }

  public async doomie (req: Request, res: Response, _next: NextFunction): Promise<void> {
    console.log('doomie')
    res.status(201).json(req.body)
  }
}

export default new GroupsController()
