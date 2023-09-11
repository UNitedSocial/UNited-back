import mongoose from 'mongoose'
import { RequestState, Role } from './group.documents'

export interface UserGroup {
  groupId: mongoose.Types.ObjectId
  groupName: string
  date: Date
  role: Role
}

export interface RequestUser {
  groupId: mongoose.Types.ObjectId
  groupName: string
  date: Date
  state: RequestState
  approvedRejectedOn?: Date
}

export interface basicUser {
  name: string
  username: string
  email: string
  groups: UserGroup[]
  requests: RequestUser[]
}
export interface User extends basicUser {
  isMaster?: boolean
}

export interface UserDocument extends mongoose.Document, User {}
