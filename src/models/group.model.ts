import mongoose, { Schema, model } from 'mongoose'
import { Classification, RecognizedInfoType, SectionTypes, MemberState, Role, RequestState, Group } from './group.documents'

export interface Book extends mongoose.Document {
  title: string
  author: string
  isbn: string
};
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
  numberOfMembers: { type: Number, required: true },
  topics: [{ type: [String], required: true }],
  clasification: { type: String, required: true, enum: Object.values(Classification), default: Classification.other },
  isRecognized: { type: Boolean, required: true },
  recognizedInfo: { type: RecognizedInfoShema, required: false },
  fundationDate: { type: Date, required: false },
  creationDate: { type: Date, required: true, default: Date.now },
  referenceImg: { type: String, required: false }
})
/*
const CarouselImageShema = new Schema({
  img: { type: String, required: true },
  description: { type: String, required: false }
})
const TitleShema = new Schema({
  title: { type: String, required: true }
})
const SubtitleShema = new Schema({
  subtitle: { type: String, required: true }
})
const ParagraphsShema = new Schema({
  paragraphs: { type: String, required: true }
})
const ListElementShema = new Schema({
  position: { type: Number, required: true, default: 0 },
  element: { type: String, required: true }
})
const ListShema = new Schema({
  style: { type: String, required: true, enum: Object.values(StyleList), default: StyleList.unordered },
  elements: [ListElementShema]
})
*/
const GroupSectionSchema = new Schema({
  position: { type: Number, required: true },
  type: { type: String, required: true, enum: Object.values(SectionTypes), default: SectionTypes.paragraphs },
  content: { type: [Schema.Types.Mixed], required: true }
})

const MembersShema = new Schema({
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
  groupInfo: GroupInfoShema,
  sections: [GroupSectionSchema],
  members: [MembersShema],
  Requests: [RequestGroupShema]
})

export default model<Group>('Group', GroupSchema)
