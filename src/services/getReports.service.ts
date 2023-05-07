import ReportModel from '../models/Report.model'
import { ReportDocument } from '../models/report.document'
import { Responses, ResponseStatus } from '../types/response.types'

class GetReports {
  public async getReports (index: number, offset: number): Promise<Responses> {
    let response: Responses
    let reports: ReportDocument [] = []

    // Get groups
    try {
      reports = await ReportModel.find({}, { _id: 0, __v: 0 }, { skip: offset, limit: index })
    } catch {
      response = {
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        message: 'Error finding users'
      }
    }

    // Check if there are groups
    if (reports.length === 0) {
      response = {
        status: ResponseStatus.NOT_FOUND,
        message: 'There are no reports to show'
      }
    } else {
      response = {
        answer: reports,
        status: ResponseStatus.OK,
        message: 'Reports found successfully'
      }
    }

    return response
  }
}

export default new GetReports()
