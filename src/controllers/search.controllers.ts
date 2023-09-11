import { NextFunction, Request, Response } from 'express'
import { displayOptions } from '../config/defaultOptions.config'
import searchGroupsService from '../services/searchGroups.service'

class SearchController {
  // Search groups
  public async searchGroups (req: Request, res: Response, _next: NextFunction): Promise<void> {
    // Get params or use default values for groups display
    const query = req.params.query
    const order = (req.query.ord !== undefined) ? req.query.ord as string : displayOptions.search.ord
    const descending = (req.query.des !== undefined) ? req.query.des as string : displayOptions.search.des
    const filter = (req.query.fil !== undefined) ? req.query.fil as string : displayOptions.search.fil
    const value = (req.query.val !== undefined) ? req.query.val as string : displayOptions.search.val
    // Call service
    const response = await searchGroupsService.searchGroups(query, order, descending, filter, value)
    console.log(response.message)
    res.status(response.status).send(response.answer)
  }
}

export default new SearchController()
