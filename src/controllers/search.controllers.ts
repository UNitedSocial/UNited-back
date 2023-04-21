import { NextFunction, Request, Response } from 'express'
import GroupModel from '../models/Group.model'
import { GroupDocument } from '../models/group.documents'

class SearchController {
  // Get groups info based in a query
  public async getQuery (req: Request, res: Response, _next: NextFunction): Promise<void> {
    const query = req.params.query
    const reg = new RegExp('^' + query + '', 'i') // Convert Query to RegExp

    // Order groups
    let order = req.query.ord
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

    // Get Groups
    await GroupModel.find({ 'info.name': { $regex: reg } }, { _id: 0, __v: 0 }).sort([[order, 1]])
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

  // Test route
  public async doomie (req: Request, res: Response, _next: NextFunction): Promise<void> {
    const n = req.query.n
    const offset = req.query.a
    console.log('Test completed sucessfully')
    res.status(200).json({ n, offset, message: 'Hola mundo' })
  }
}

export default new SearchController()
