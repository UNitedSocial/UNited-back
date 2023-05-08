import ReportModel from '../models/Report.model'
import { ReportDocument } from '../models/report.document'
import { Responses, ResponseStatus } from '../types/response.types'

class StateReports {
  public async stateReports (description: string, des: number): Promise<Responses> {
    let response: Responses
    let report: ReportDocument [] | null = null

    // Get groups
    try {
      report = await ReportModel.findOne({ 'reportInfo.description': description }, { _id: 0, __v: 0 })
    } catch {
      response = {
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        message: 'Error finding report'
      }
    }

    // Check if there are resports
    if (report === null) {
      response = {
        status: ResponseStatus.NOT_FOUND,
        message: 'The Report doesn\'t exist'
      }
      return response
    } else {
      // Edit the state of the report
      await ReportModel.updateOne({ 'reportInfo.description': description }, { state: 'closed' })
      if (des === 1) {
        response = {
          answer: 'The report is correct',
          status: ResponseStatus.OK,
          message: 'The report has been processed'
        }
      } else {
        response = {
          answer: 'The report is not correct',
          status: ResponseStatus.OK,
          message: 'The report has been processed'
        }
      }

      return response
    }
  }
}

export default new StateReports()
