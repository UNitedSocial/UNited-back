import { Schema, model } from 'mongoose'
import { Role, RequestState } from './group.documents'
import { UserDocument } from './user.documents'
// TODO: refactor model to avoid _id unnecessary fields on everywhere
const USerGrooupSchema = new Schema({
  groupId: { type: Schema.Types.ObjectId, required: true, ref: 'Group' },
  groupName: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
  role: { type: String, required: true, enum: Object.values(Role) }
})

const requestUserSchema = new Schema({
  GroupId: { type: Schema.Types.ObjectId, required: true, ref: 'Group' },
  groupName: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
  state: { type: String, required: true, enum: Object.values(RequestState), default: RequestState.pending },
  approvedRejectedOn: { type: Date, required: false }
})
const UserSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  groups: [USerGrooupSchema],
  requests: [requestUserSchema]
})

export default model<UserDocument>('User', UserSchema)
