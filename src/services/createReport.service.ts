import { now } from 'mongoose'
import UserModel from '../models/User.model'
import GroupModel from '../models/Group.model'
import ReportModel from '../models/Report.model'
import { UserDocument } from '../models/user.documents'
import { GroupDocument } from '../models/group.documents'
import { ReportDocument, ReportState, ReportUserType, ReportUser, ReportGroup, ReportError, Feedback } from '../models/report.document'
import { Responses, ResponseStatus } from '../types/response.types'

class CreateReport {
  public async createReport (username: string, report: ReportDocument): Promise<Responses> {
    let response: Responses
    let userDoc: UserDocument | null = null

    // Check if all the report information is provided
    if (report === undefined || report.reportType === undefined || report.reportInfo === undefined) {
      response = {
        status: ResponseStatus.BAD_REQUEST,
        message: 'Missing report information'
      }
      return response
    }

    // Get user
    try {
      userDoc = await UserModel.findOne({ username }, { __v: 0 })
    } catch {
      response = {
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        message: 'Error finding user'
      }
    }

    // Check if the user exists and assign the user type and data
    if (userDoc === null) {
      report.userType = ReportUserType.anonymous
    } else {
      report.userType = ReportUserType.registered
      const reportingUser = {
        userId: userDoc._id,
        name: userDoc.name,
        username: userDoc.username,
        email: userDoc.email
      }
      report.reportingUser = reportingUser
    }

    // Select report type and try to create the report
    let newReport: ReportDocument
    switch (report.reportType) {
      case 'reportUser':
        try {
          newReport = await this.createUserReport(report)
        } catch {
          response = {
            status: ResponseStatus.BAD_REQUEST,
            message: 'Error creating report'
          }
          return response
        }
        break
      case 'reportGroup':
        try {
          newReport = await this.createGroupReport(report)
        } catch {
          response = {
            status: ResponseStatus.BAD_REQUEST,
            message: 'Error creating report'
          }
          return response
        }
        break
      case 'reportError':
        try {
          newReport = await this.createErrorReport(report)
        } catch {
          response = {
            status: ResponseStatus.BAD_REQUEST,
            message: 'Error creating report'
          }
          return response
        }
        break
      case 'feedback':
        try {
          newReport = await this.createFeedback(report)
        } catch {
          response = {
            status: ResponseStatus.BAD_REQUEST,
            message: 'Error creating report'
          }
          return response
        }
        break
      default:
        response = {
          status: ResponseStatus.BAD_REQUEST,
          message: 'Report type doesn\'t exist'
        }
        return response
    }

    // Save the report
    try {
      await newReport.save()
    } catch {
      response = {
        status: ResponseStatus.BAD_REQUEST,
        message: 'Error saving report'
      }
      return response
    }

    response = {
      status: ResponseStatus.OK,
      message: 'Report created successfully'
    }

    return response
  }

  private async createUserReport (report: ReportDocument): Promise<ReportDocument> {
    // Check if data is provided correctly
    const reportInfo = report.reportInfo as ReportUser
    if (reportInfo.user === undefined || reportInfo.reason === undefined || reportInfo.description === undefined) {
      console.log('Missing report information')
      throw new Error()
    }

    // Get reported user
    let userDoc: UserDocument | null = null
    try {
      userDoc = await UserModel.findOne({ username: reportInfo.user.username }, { __v: 0 })
    } catch {
      console.log('Error finding group')
      throw new Error()
    }

    // Check if the user exists and assign the user data
    if (userDoc === null) {
      console.log('User doesn\'t exist')
      throw new Error()
    } else {
      const reportedUser = {
        userId: userDoc._id,
        name: userDoc.name,
        username: userDoc.username,
        email: userDoc.email
      }
      reportInfo.user = reportedUser
    }

    // Create the report
    report.reportInfo = reportInfo
    report.date = new Date(now())
    report.state = ReportState.pending
    const newReport: ReportDocument = new ReportModel(report)
    console.log('User report created')
    return newReport
  }

  private async createGroupReport (report: ReportDocument): Promise<ReportDocument> {
    // Check if data is provided correctly
    const reportInfo = report.reportInfo as ReportGroup
    if (reportInfo.group === undefined || reportInfo.reason === undefined || reportInfo.description === undefined) {
      console.log('Missing report information')
      throw new Error()
    }

    // Get reported group
    let groupDoc: GroupDocument | null = null
    try {
      groupDoc = await GroupModel.findOne({ 'info.name': reportInfo.group.groupName }, { __v: 0 })
    } catch {
      console.log('Error finding group')
      throw new Error()
    }

    // Check if the group exists and assign the group data
    if (groupDoc === null) {
      console.log('Group doesn\'t exist')
      throw new Error()
    } else {
      const reportedGroup = {
        groupId: groupDoc._id,
        groupName: groupDoc.info.name
      }
      reportInfo.group = reportedGroup
    }

    // Create the report
    report.reportInfo = reportInfo
    report.date = new Date(now())
    report.state = ReportState.pending
    const newReport: ReportDocument = new ReportModel(report)
    console.log('Group report created')
    return newReport
  }

  private async createErrorReport (report: ReportDocument): Promise<ReportDocument> {
    // Check if data is provided correctly
    const reportInfo = report.reportInfo as ReportError
    if (reportInfo.page === undefined || reportInfo.description === undefined) {
      console.log('Missing report information')
      throw new Error()
    }

    // Create the report
    report.reportInfo = reportInfo
    report.date = new Date(now())
    report.state = ReportState.pending
    const newReport: ReportDocument = new ReportModel(report)
    console.log('Error report created')
    return newReport
  }

  private async createFeedback (report: ReportDocument): Promise<ReportDocument> {
    // Check if data is provided correctly
    const reportInfo = report.reportInfo as Feedback
    if (reportInfo.description === undefined) {
      console.log('Missing report information')
      throw new Error()
    }

    // Create the report
    report.reportInfo = reportInfo
    report.date = new Date(now())
    report.state = ReportState.pending
    const newReport: ReportDocument = new ReportModel(report)
    console.log('Feedback created')
    return newReport
  }
}

export default new CreateReport()
