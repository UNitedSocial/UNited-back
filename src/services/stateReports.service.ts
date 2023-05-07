import ReportModel from '../models/Report.model'
import { ReportDocument } from '../models/report.document'
import { Responses, ResponseStatus } from '../types/response.types'

class StateReports {
  public async stateReports (description: string, des: number): Promise<Responses> {
    let response: Responses
    let reports: ReportDocument [] | null = null
    // Get groups
    try {
      reports = await ReportModel.findOne({ 'reportInfo.description': description }, { _id: 0, __v: 0 })
    } catch {
      response = {
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        message: 'Error finding reports'
      }
    }

    // Check if there are resports
    if (reports === null) {
      response = {
        status: ResponseStatus.NOT_FOUND,
        message: 'The Report doesn\'t exist'
      }
      return response
    } else {
    // edit the state of the report
      await ReportModel.updateOne({ 'reportInfo.description': description }, { state: 'closed' })
      if (des === 1) {
        response = {
          status: ResponseStatus.OK,
          message: 'The report has been processed'
        }
      } else {
        response = {
          status: ResponseStatus.OK,
          message: 'The report is not correct'
        }
      }

      return response
    }
  }
}

export default new StateReports()
