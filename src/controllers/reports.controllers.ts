import { NextFunction, Request, Response } from 'express'
import { displayOptions } from '../config/defaultOptions.config'
import createReportService from '../services/createReport.service'
import seeReportsService from '../services/seeReports.service'

class ReportsController {
  // Create new report
  public async createReport (req: Request, res: Response, _next: NextFunction): Promise<void> {
    // Get report data
    const username = (req.body.user.username !== undefined) ? req.body.user.username : displayOptions.report.anonymous
    const { report } = req.body
    // Call service
    const response = await createReportService.createReport(username, report)
    console.log(response.message)
    res.status(response.status).send(response.answer)
  }

  // See reports
  public async seeReports (req: Request, res: Response, _next: NextFunction): Promise<void> {
    // Get params or use default values for users display
    const index = (req.query.n !== undefined) ? Number(req.query.n) : displayOptions.index.n
    const offset = (req.query.o !== undefined) ? Number(req.query.o) : displayOptions.index.offset
    const username = req.params.username
    // Call service
    const response = await seeReportsService.seeReports(username, index, offset)
    console.log(response.message)
    res.status(response.status).send(response.answer)
  }
}

export default new ReportsController()
