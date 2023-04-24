import mongoose from 'mongoose'

// Info of types
export enum RecognizedInfoType {
  hotbed = 'Semillero',
  group = 'Grupo estudiantil',
  project = 'Proyecto estudiantil',
}

export enum Classification {
  academic = 'Académico',
  cultural = 'Cultural',
  leisure = 'Ocio',
  other = 'Otro',
}

export interface SocialNetworks {
  facebook?: string
  instagram?: string
  linkedin?: string
  twitter?: string
  youtube?: string
}

export interface Contact {
  mail: string
  page?: string
  cellphone: string
  socialNetworks: SocialNetworks
}

export interface RecognizedInfo {
  type: RecognizedInfoType
  faculty?: string
  department?: string
  mainProfessor?: string
}

export interface GroupInfo {
  name: string
  description: string
  contact: Contact
  numberOfMembers: number
  numberOfPublications: number
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

export interface carouselImage {
  img: string
  description?: string
}

export interface carousel {
  images: carouselImage[]
}

export interface title {
  title: string
}

export interface subtitle {
  subtitle: string
}

export interface paragraph {
  paragraph: string
}

export enum StyleList {
  ordered = 'ordered',
  unordered = 'unordered'
}

export interface listElement {
  position: number
  line: string
}

export interface listContent {
  style: StyleList
  elements: listElement[]
}

export interface groupSections {
  position: number
  type: SectionTypes
  content: carousel | title | subtitle | paragraph | listContent
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

export interface Member {
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

export interface Requests {
  userId: mongoose.Types.ObjectId
  username: string
  name: string
  date: Date
  state: RequestState
  approvedRejectedOn?: Date
}

export interface Group {
  info: GroupInfo
  members: Member[]
  requests: Requests[]
  page: groupSections[]
}

export interface GroupDocument extends mongoose.Document, Group {}
