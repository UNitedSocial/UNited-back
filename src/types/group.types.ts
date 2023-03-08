// info types

export enum RecognizedInfoType {
  hotbed = 'semillero',
  group = 'grupo estudiantil',
  project = 'proyecto de investigación',
}
export enum Classification {
  academic = 'Académico',
  cultural = 'Cultural',
  sports = 'Deportivo',
  social = 'Social',
  artistic = 'Artístico',
  religious = 'Religioso',
}

export interface SocialNetworks {
  facebook: string
  instagram: string
  linkedin: string
  twitter: string
  youtube: string
}

export interface Contact {
  mail: string
  page: string
  cellphone: string
  socialNetworks: SocialNetworks
}
export interface RecognizedInfo {
  type: RecognizedInfoType
  faculty: string
  department: string
  mainProfessor: string
}
export interface GroupInfo {
  name: string
  description: string
  contact: Contact
  numberOfMembers: number
  topics: string[]
  classification: Classification
  isRecognized: boolean
  recognizedInfo: RecognizedInfo
  fundationDate: string
  creationDate: string
  referenceImg: string
}

export enum SectionTypes {
  carousel = 'carousel',
  title = 'title',
  subtitle = 'subtitle',
  paragraphs = 'paragraphs',
  list = 'list',
}

// Page types

export interface carouselImage {
  img: string
  description: string
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

export interface paragraphs {
  paragraphs: string
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
  content: carousel | title | subtitle | paragraphs | listContent
}

// Group types

export enum Rol {
  editor = 'editor',
  member = 'member'
}
export enum MemberState {
  active = 'active',
  inactive = 'inactive'
}
export interface Members {
  userId: string
  username: string
  name: string
  rol: Rol
  state: MemberState
}
export enum RequestState {
  approved = 'approved',
  rejected = 'rejected'
}
export interface Requests {
  userId: string
  username: string
  name: string
  date: string
  state: RequestState
  approvedRejectedOn: string
}

export interface Group {
  id: string
  info: GroupInfo
  members: Members[]
  requests: Requests[]
  page: groupSections[]
}
