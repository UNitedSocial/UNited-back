import mongoose from 'mongoose'

export enum ReportType {
  reportUser = 'reportUser',
  reportGroup = 'reportGroup',
  reportError = 'reportError',
  feedback = 'feedback'
}
export enum ReportState {
  pending = 'pending',
  approved = 'closed'
}
export enum ReportUserType {
  registered = 'registered',
  anonymous = 'anonymous',
  notRegistered = 'notRegistered'
}
export enum ReportReasons {
  spam = 'spam',
  unauthorizedSales = 'unauthorizedSales',
  violence = 'violence',
  hateSpeech = 'hateSpeech',
  falseInformation = 'falseInformation',
  harassment = 'harassment',
  identityTheft = 'identityTheft',
  nudity = 'nudity'
}
export interface ReportUser {
  user: {
    userId: mongoose.Types.ObjectId
    username: string
    name: string
    email: string
  }
  reason: ReportReasons
  description: string
}

export interface ReportGroup {
  group: {
    groupId: mongoose.Types.ObjectId
    groupName: string
  }
  reason: ReportReasons
  description: string
}

export interface ReportError {
  page: string
  description: string
}

export interface Feedback {
  description: string
}

export interface ReportingUser {
  userId?: mongoose.Types.ObjectId
  name: string
  username?: string
  email: string
}

export interface ReportInterface {
  reportType: ReportType
  report: ReportUser | ReportGroup | ReportError | Feedback
  userType: ReportUserType
  reportingUser?: ReportingUser // exists if the user is not anonymous
  date: Date
  closedDate?: Date
  state: ReportState
  masterComment?: string
}

export interface ReportDocument extends mongoose.Document, ReportInterface {}
