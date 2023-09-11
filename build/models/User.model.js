"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const group_documents_1 = require("./group.documents");
const USerGrooupSchema = new mongoose_1.Schema({
    groupId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'Group' },
    groupName: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    role: { type: String, required: true, enum: Object.values(group_documents_1.Role) }
});
const RequestUserSchema = new mongoose_1.Schema({
    groupId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'Group' },
    groupName: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    state: { type: String, required: true, enum: Object.values(group_documents_1.RequestState), default: group_documents_1.RequestState.pending },
    approvedRejectedOn: { type: Date, required: false }
});
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    groups: [USerGrooupSchema],
    requests: [RequestUserSchema],
    isMaster: { type: Boolean, required: false, default: false }
});
exports.default = (0, mongoose_1.model)('User', UserSchema);
