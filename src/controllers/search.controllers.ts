import { NextFunction, Request, Response } from 'express'
import GroupModel from '../models/Group.model'
import { GroupDocument } from '../models/group.documents'

class SearchController {
  // Get groups info based to the query
  public async getQuery (req: Request, res: Response, _next: NextFunction): Promise<void> {
    const query = req.params.query
    await GroupModel.find({ 'info.name': query }, { _id: 0, __v: 0 })
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
    res.status(200).json({ n, offset, message: 'Test completed sucessfully' })
  }
}

export default new SearchController()
