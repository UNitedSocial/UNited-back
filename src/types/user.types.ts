import { RequestState } from './group.types'

export interface UserGroup {
  groupId: string
  groupName: string
  date: string
  isEditor: boolean
}

export interface requestUser {
  groupId: string
  groupName: string
  date: string
  state: RequestState
  approvedRejectedOn: string
}

export interface User {
  id: string
  name: string
  username: string
  email: string
  groups: UserGroup[]
  requests: requestUser[]
}
