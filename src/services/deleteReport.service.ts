import mongoose from 'mongoose'
import ReportModel from '../models/Report.model'
// import { ReportDocument } from '../models/report.document'
import { Responses, ResponseStatus } from '../types/response.types'

class DeleteReport {
  public async deleteReport (reportID: string): Promise<Responses> {
    let response: Responses
    if (reportID === 'none') {
      response = {
        status: ResponseStatus.BAD_REQUEST,
        message: 'No report ID provided'
      }
      return response
    }

    // Get groups

    const result = await ReportModel.findByIdAndDelete(new mongoose.Types.ObjectId(reportID))
      .catch((err) => {
        console.log(err)
        return null
      })
    if (result === null) {
      response = {
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        message: 'Error finding reports'
      }
    } else {
      response = {
        status: ResponseStatus.OK,
        message: 'Report deleted successfully',
        answer: result
      }
    }

    return response
  }
}

export default new DeleteReport()
