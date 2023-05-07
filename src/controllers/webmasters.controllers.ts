import { NextFunction, Request, Response } from 'express'
import { displayOptions } from '../config/defaultOptions.config'
import deleteGroupService from '../services/deleteGroup.service'
import getReportsService from '../services/getReports.service'

class WebmastersController {
  // Delete group
  public async deleteGroup (req: Request, res: Response, _next: NextFunction): Promise<void> {
    // Get groupname
    const groupname = req.params.groupname
    // Call service
    const response = await deleteGroupService.deleteGroup(groupname)
    console.log(response.message)
    res.status(response.status).send(response.answer)
  }

  // Get Reports
  public async getReports (req: Request, res: Response, _next: NextFunction): Promise<void> {
    // Get params or use default values for groups display
    const index = (req.query.n !== undefined) ? Number(req.query.n) : displayOptions.index.n
    const offset = (req.query.o !== undefined) ? Number(req.query.o) : displayOptions.index.offset
    // Get only the info field
    const response = await getReportsService.getReports(index, offset)
    console.log(response.message)
    res.status(response.status).send(response.answer)
  }
}

export default new WebmastersController()
