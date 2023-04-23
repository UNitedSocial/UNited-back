import { NextFunction, Request, Response } from 'express'
import GroupModel from '../models/Group.model'
import { GroupDocument } from '../models/group.documents'

class SearchController {
  // Get groups info based in a query
  public async getQuery (req: Request, res: Response, _next: NextFunction): Promise<void> {
    let valor = req.body.valor

    const query = req.params.query
    const reg = new RegExp('^' + query + '', 'i') // Convert Query to RegExp

    // Order groups
    let order = req.body.ord
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
    
    let dec = req.body.dec
    switch (dec) {
      case 'topics':
        dec = 'info.topics'
        break
      case 'classification':
        dec = 'info.clasification'
        break
      case 'members':
        dec = 'info.numberOfMembers'
        break
      case 'date':
        dec = 'info.creationDate'
        break
      case 'recognized':
        dec = 'info.isRecognized'
        break
      default:
        dec = 'info.name'
        valor = { $exists: true }
        break
    } // Get Groups
    if (dec === 'info.numberOfMembers') {
      await GroupModel.find({ $and: [{ 'info.name': { $regex: reg } }, { [dec]: { $eq: valor } }] }, { _id: 0, __v: 0 }).sort([[order, 1]])
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
      await GroupModel.find({ $and: [{ 'info.name': { $regex: reg } }, { [dec]: valor }] }, { _id: 0, __v: 0 }).sort([[order, 1]])
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
  }

export default new SearchController()
