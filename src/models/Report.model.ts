import { Schema, model } from 'mongoose'
import { ReportDocument, ReportState } from './report.document'

const ReportingUserSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'Users' },
  name: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true }
})

const ReportSchema = new Schema({
  reportType: { type: String, required: true },
  report: { type: Schema.Types.Mixed, required: true },
  userType: { type: String, required: true },
  reportingUser: { type: ReportingUserSchema, required: false }, // exists if the user is not anonymous
  date: { type: Date, required: true, default: Date.now },
  closedDate: { type: Date, required: false },
  state: { type: String, required: true, default: ReportState.pending },
  masterComment: { type: String, required: false }
})

export default model<ReportDocument>('Report', ReportSchema)
