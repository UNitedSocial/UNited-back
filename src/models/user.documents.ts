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

export interface User {
  name: string
  username: string
  email: string
  groups: UserGroup[]
  requests: RequestUser[]
}

export interface UserDocument extends mongoose.Document, User {}
