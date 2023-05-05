import { NextFunction, Request, Response } from 'express'
import createReportService from '../services/createReport.service'

class ReportController {
  // Create a request
  public async createReport (req: Request, res: Response, _next: NextFunction): Promise<void> {
    const { reportType, report, user, userType } = req.body
    const response = createReportService.createReport(reportType, report, user, userType)
    await response
    res.status(200).send({ reportType, report, user })
  }
}

export default new ReportController()
