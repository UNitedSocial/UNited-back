import { RequestState, Role } from './group.documents'
import mongoose from 'mongoose'

export interface UserGroup extends mongoose.Document {
  groupId: mongoose.Types.ObjectId
  groupName: string
  date: string
  role: Role
}

export interface requestUser extends mongoose.Document {
  groupId: mongoose.Types.ObjectId
  groupName: string
  date: string
  state: RequestState
  approvedRejectedOn?: string
}

export interface User {
  name: string
  username: string
  email: string
  groups: UserGroup[]
  requests: requestUser[]
}
