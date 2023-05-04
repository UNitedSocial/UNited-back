import { now } from 'mongoose'
import { Feedback, ReportDocument, ReportError, ReportGroup, ReportInterface, ReportState, ReportType, ReportUser, ReportUserType, ReportingUser } from '../models/report.document'
import { Responses, ResponseStatus } from '../types/response.types'
import ReportModel from '../models/Report.model'

class CreateReport {
  public async createReport (reportType: ReportType, report: any, user: any, userType: ReportUserType): Promise<Responses> {
    const response: Responses = {
      status: ResponseStatus.NOT_FOUND,
      message: 'The User doesn\'t exist'
    }
    let reportFinal: ReportUser | ReportGroup | ReportError | Feedback | undefined
    // Select report type and make the report
    switch (reportType) {
      case ReportType.reportUser :
        reportFinal = this.createReportUser(report)
        break
      case ReportType.reportGroup:
        reportFinal = this.createReportGroup(report)
        break
      case ReportType.reportError:
        reportFinal = this.createReportError(report)
        break
      case ReportType.feedback:
        reportFinal = this.createFeedback(report)
        break
      default:
        // if the report type is not found send a bad request
        response.status = ResponseStatus.BAD_REQUEST
        response.message = 'report type not found'
        return response
    }
    // Make sure the report has a valid format
    if (reportFinal === undefined) {
      response.status = ResponseStatus.BAD_REQUEST
      response.message = 'bad report'
      return response
    }
    // Create the report document to save
    const reportInterface: ReportInterface = {
      reportType,
      userType,
      date: new Date(now()),
      reportingUser: await this.createReportingUSer(user.username),
      state: ReportState.pending,
      report: reportFinal
    }
    const reportDocument: ReportDocument = new ReportModel(reportInterface)
    // Save the report
    await reportDocument.save()
      .then(() => {
        response.status = ResponseStatus.OK
        response.message = 'report created'
      })
      .catch((err) => {
        response.status = ResponseStatus.INTERNAL_SERVER_ERROR
        response.message = err.message
      })

    return response
  }

  private async createReportingUSer (_username: string): Promise<ReportingUser | undefined> {
    // TODO
    return undefined
  }

  private createReportUser (_report: any): ReportUser | undefined {
    // TODO
    return undefined
  }

  private createReportGroup (_report: any): ReportGroup | undefined {
    // TODO
    return undefined
  }

  private createReportError (_report: any): ReportError | undefined {
    // TODO
    return undefined
  }

  private createFeedback (_report: any): Feedback | undefined {
    // TODO
    return undefined
  }
}

export default new CreateReport()
