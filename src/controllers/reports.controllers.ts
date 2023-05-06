import { NextFunction, Request, Response } from 'express'
import { displayOptions } from '../config/defaultOptions.config'
import createReportService from '../services/createReport.service'

class ReportController {
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
}

export default new ReportController()
