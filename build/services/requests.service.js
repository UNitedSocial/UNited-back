"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const group_documents_1 = require("../models/group.documents");
class RequestService {
    userIsInGroup(user, group) {
        // check if the user is in the group
        let userInGroup = false;
        group === null || group === void 0 ? void 0 : group.members.forEach(member => {
            if (member.username === user.username) {
                userInGroup = true;
            }
        });
        return userInGroup;
    }
    userHasActiveRequest(user, group) {
        // check if the user has an active request
        let activeRequest = false;
        group === null || group === void 0 ? void 0 : group.requests.forEach(request => {
            if (request.username === (user === null || user === void 0 ? void 0 : user.username) && request.state === group_documents_1.RequestState.pending) {
                activeRequest = true;
            }
        });
        return activeRequest;
    }
    createRequestObjects(user, group) {
        // create request object for user and for group
        const date = new Date((0, mongoose_1.now)());
        const requestUser = {
            groupId: new mongoose_1.default.Types.ObjectId(group._id),
            groupName: group.info.name,
            date,
            state: group_documents_1.RequestState.pending
        };
        const requestGroup = {
            userId: new mongoose_1.default.Types.ObjectId(user._id),
            username: user.username,
            name: user.name,
            date,
            state: group_documents_1.RequestState.pending
        };
        return { requestUser, requestGroup };
    }
    validateUserRequest(user, group) {
        // check if the user is in the group
        if (this.userIsInGroup(user, group)) {
            return false;
        }
        // check if the user has an active request
        if (this.userHasActiveRequest(user, group)) {
            return false;
        }
        return true;
    }
}
exports.default = new RequestService();
