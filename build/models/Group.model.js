"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const group_documents_1 = require("./group.documents");
const SocialNetworks = new mongoose_1.Schema({
    facebook: { type: String, required: false },
    instagram: { type: String, required: false },
    linkedin: { type: String, required: false },
    twitter: { type: String, required: false },
    youtube: { type: String, required: false }
});
const ContactShema = new mongoose_1.Schema({
    mail: { type: String, required: true },
    page: { type: String, required: false },
    cellphone: { type: String, required: true },
    socialNetworks: SocialNetworks
});
const RecognizedInfoShema = new mongoose_1.Schema({
    type: { type: String, required: true, enum: Object.values(group_documents_1.RecognizedInfoType) },
    faculty: { type: String, required: false },
    department: { type: String, required: false },
    mainProfessor: { type: String, required: false }
});
const GroupInfoShema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    contact: ContactShema,
    numberOfMembers: { type: Number, required: true, default: 1 },
    numberOfPublications: { type: Number, required: true, default: 0 },
    topics: [{ type: String, required: true }],
    clasification: { type: String, required: true, enum: Object.values(group_documents_1.Classification), default: group_documents_1.Classification.other },
    isRecognized: { type: Boolean, required: true },
    recognizedInfo: { type: RecognizedInfoShema, required: false },
    fundationDate: { type: Date, required: false },
    creationDate: { type: Date, required: true, default: Date.now },
    referenceImg: { type: String, required: false }
});
const GroupSectionSchema = new mongoose_1.Schema({
    position: { type: Number, required: true },
    type: { type: String, required: true, enum: Object.values(group_documents_1.SectionTypes), default: group_documents_1.SectionTypes.paragraphs },
    content: { type: mongoose_1.Schema.Types.Mixed, required: true }
});
const MemberShema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'Users' },
    name: { type: String, required: true },
    username: { type: String, required: true },
    role: { type: String, required: true, enum: Object.values(group_documents_1.Role), default: group_documents_1.Role.member },
    state: { type: String, required: true, enum: Object.values(group_documents_1.MemberState), default: group_documents_1.MemberState.active }
});
const RequestGroupShema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'Users' },
    name: { type: String, required: true },
    username: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    state: { type: String, required: true, enum: Object.values(group_documents_1.RequestState), default: group_documents_1.RequestState.pending },
    approvedRejectedOn: { type: Date, required: false }
});
const GroupSchema = new mongoose_1.Schema({
    info: GroupInfoShema,
    members: [MemberShema],
    requests: [RequestGroupShema],
    page: [GroupSectionSchema]
});
exports.default = (0, mongoose_1.model)('Group', GroupSchema);
