// info types

import mongoose from 'mongoose'

export enum RecognizedInfoType {
  hotbed = 'semillero',
  group = 'grupo estudiantil',
  project = 'proyecto de investigación',
}
export enum Classification {
  academic = 'Académico',
  cultural = 'Cultural',
  leisure = 'Ocio',
  other = 'Otro',
}

export interface SocialNetworks extends mongoose.Document {
  facebook?: string
  instagram?: string
  linkedin?: string
  twitter?: string
  youtube?: string
}

export interface Contact extends mongoose.Document {
  mail: string
  page?: string
  cellphone: string
  socialNetworks: SocialNetworks
}

export interface RecognizedInfo extends mongoose.Document {
  type: RecognizedInfoType
  faculty?: string
  department?: string
  mainProfessor?: string
}
export interface GroupInfo extends mongoose.Document {
  name: string
  description: string
  contact: Contact
  numberOfMembers: number
  topics: string[]
  classification: Classification
  isRecognized: boolean
  recognizedInfo?: RecognizedInfo
  fundationDate?: Date
  creationDate: Date
  referenceImg: false
}

// Page types

export enum SectionTypes {
  carousel = 'carousel',
  title = 'title',
  subtitle = 'subtitle',
  paragraphs = 'paragraphs',
  list = 'list',
}

export interface carouselImage extends mongoose.Document {
  img: string
  description?: string
}

export interface carousel extends mongoose.Document {
  images: carouselImage[]
}

export interface title extends mongoose.Document {
  title: string
}

export interface subtitle extends mongoose.Document {
  subtitle: string
}

export interface paragraphs extends mongoose.Document {
  paragraphs: string
}

export enum StyleList {
  ordered = 'ordered',
  unordered = 'unordered'
}

export interface listElement extends mongoose.Document {
  position: number
  line: string
}

export interface listContent extends mongoose.Document {
  style: StyleList
  elements: listElement[]
}

export interface groupSections extends mongoose.Document {
  position: number
  type: SectionTypes
  content: carousel | title | subtitle | paragraphs | listContent
}

// Group types

export enum Role {
  editor = 'editor',
  member = 'member'
}
export enum MemberState {
  active = 'active',
  inactive = 'inactive'
}
export interface Members extends mongoose.Document {
  userId: mongoose.Types.ObjectId
  username: string
  name: string
  role: Role
  state: MemberState
}
export enum RequestState {
  approved = 'approved',
  rejected = 'rejected',
  pending = 'pending'
}
export interface Requests extends mongoose.Document {
  userId: mongoose.Types.ObjectId
  username: string
  name: string
  date: string
  state: RequestState
  approvedRejectedOn?: string
}

export interface Group {
  info: GroupInfo
  members: Members[]
  requests: Requests[]
  page: groupSections[]
}
