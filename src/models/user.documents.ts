import { RequestState, Role } from './group.documents'
import mongoose from 'mongoose'

export interface UserGroup {
  groupId: mongoose.Types.ObjectId
  groupName: string
  date: Date
  role: Role
}

export interface requestUser {
  groupId: mongoose.Types.ObjectId
  groupName: string
  date: Date
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
export interface UserDocument extends mongoose.Document, User {}
