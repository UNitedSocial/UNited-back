import mongoose from 'mongoose'
import { GroupDocument, Requests } from './group.documents'
import { UserDocument } from './user.documents'

export enum ResponseStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500
}

export interface Responses {
  status: ResponseStatus
  answer?: UserDocument | GroupDocument | UserDocument[] | GroupDocument[] | Requests | Requests[]
  message?: string
  err?: string
}

export interface ResponseDocument extends mongoose.Document, Responses {}
