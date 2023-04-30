import { Schema, model } from 'mongoose'
import { Classification, RecognizedInfoType, SectionTypes, MemberState, Role, RequestState, GroupDocument } from './group.documents'

const SocialNetworks = new Schema({
  facebook: { type: String, required: false },
  instagram: { type: String, required: false },
  linkedin: { type: String, required: false },
  twitter: { type: String, required: false },
  youtube: { type: String, required: false }
})

const ContactShema = new Schema({
  mail: { type: String, required: true },
  page: { type: String, required: false },
  cellphone: { type: String, required: true },
  socialNetworks: SocialNetworks
})

const RecognizedInfoShema = new Schema({
  type: { type: String, required: true, enum: Object.values(RecognizedInfoType) },
  faculty: { type: String, required: false },
  department: { type: String, required: false },
  mainProfessor: { type: String, required: false }
})

const GroupInfoShema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  contact: ContactShema,
  numberOfMembers: { type: Number, required: true, default: 1 },
  numberOfPublications: { type: Number, required: true, default: 0 },
  topics: [{ type: String, required: true }],
  clasification: { type: String, required: true, enum: Object.values(Classification), default: Classification.other },
  isRecognized: { type: Boolean, required: true },
  recognizedInfo: { type: RecognizedInfoShema, required: false },
  fundationDate: { type: Date, required: false },
  creationDate: { type: Date, required: true, default: Date.now },
  referenceImg: { type: String, required: false }
})

const GroupSectionSchema = new Schema({
  position: { type: Number, required: true },
  type: { type: String, required: true, enum: Object.values(SectionTypes), default: SectionTypes.paragraphs },
  content: { type: Schema.Types.Mixed, required: true }
})

const MemberShema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'Users' },
  name: { type: String, required: true },
  username: { type: String, required: true },
  role: { type: String, required: true, enum: Object.values(Role), default: Role.member },
  state: { type: String, required: true, enum: Object.values(MemberState), default: MemberState.active }
})

const RequestGroupShema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'Users' },
  name: { type: String, required: true },
  username: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
  state: { type: String, required: true, enum: Object.values(RequestState), default: RequestState.pending },
  approvedRejectedOn: { type: Date, required: false }
})

const GroupSchema = new Schema({
  info: GroupInfoShema,
  members: [MemberShema],
  requests: [RequestGroupShema],
  page: [GroupSectionSchema]
})

export default model<GroupDocument>('Group', GroupSchema)
