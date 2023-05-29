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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const User_model_1 = __importDefault(require("../models/User.model"));
const Group_model_1 = __importDefault(require("../models/Group.model"));
const group_documents_1 = require("../models/group.documents");
const response_types_1 = require("../types/response.types");
class AnswerRequest {
    answerRequest(groupname, username, answer) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoose_1.default.startSession();
            let response;
            let groupDoc;
            let userDoc;
            console.log(groupname, username, answer);
            // Check if answer is valid
            if (answer !== 'approved' && answer !== 'rejected') {
                response = {
                    status: response_types_1.ResponseStatus.BAD_REQUEST,
                    message: 'Answer is not valid'
                };
                return response;
            }
            // Get group and user data
            try {
                groupDoc = yield Group_model_1.default.findOne({ 'info.name': groupname });
                userDoc = yield User_model_1.default.findOne({ username });
            }
            catch (_a) {
                response = {
                    status: response_types_1.ResponseStatus.INTERNAL_SERVER_ERROR,
                    message: 'Error getting user or group'
                };
                return response;
            }
            // Check if group and user exist
            if (groupDoc == null || userDoc == null) {
                response = {
                    status: response_types_1.ResponseStatus.NOT_FOUND,
                    message: 'User or group doesn\'t exist'
                };
                return response;
            }
            // Get only pending request in user and group
            const requestUser = userDoc === null || userDoc === void 0 ? void 0 : userDoc.requests.find(request => (request === null || request === void 0 ? void 0 : request.groupName) === groupname && request.state === group_documents_1.RequestState.pending);
            const requestGroup = groupDoc === null || groupDoc === void 0 ? void 0 : groupDoc.requests.find(request => request.username === username && request.state === group_documents_1.RequestState.pending);
            // Check if request exists
            if (requestUser == null || requestGroup == null) {
                response = {
                    status: response_types_1.ResponseStatus.NOT_FOUND,
                    message: 'Request doesn\'t exist'
                };
                return response;
            }
            // Delete request from user and group
            userDoc.requests = userDoc.requests.filter(request => (request === null || request === void 0 ? void 0 : request.groupName) !== groupname || request.state !== group_documents_1.RequestState.pending);
            groupDoc.requests = groupDoc.requests.filter(request => (request === null || request === void 0 ? void 0 : request.username) !== username || request.state !== group_documents_1.RequestState.pending);
            // Check value of answer
            if (answer === 'rejected') {
                // Delete request from user and group
                requestGroup.state = group_documents_1.RequestState.rejected;
                groupDoc.requests.push(requestGroup);
                requestUser.state = group_documents_1.RequestState.rejected;
                userDoc.requests.push(requestUser);
            }
            else {
                // Add member to group
                groupDoc.members.push({
                    userId: new mongoose_1.default.Types.ObjectId(userDoc._id),
                    username: userDoc.username,
                    name: userDoc.name,
                    role: 'member',
                    state: 'active'
                });
                // Add group to user
                userDoc.groups.push({
                    groupId: new mongoose_1.default.Types.ObjectId(groupDoc === null || groupDoc === void 0 ? void 0 : groupDoc._id),
                    groupName: groupDoc.info.name,
                    role: 'member',
                    date: new Date((0, mongoose_1.now)())
                });
                requestGroup.state = group_documents_1.RequestState.approved;
                groupDoc.requests.push(requestGroup);
                requestUser.state = group_documents_1.RequestState.approved;
                userDoc.requests.push(requestUser);
            }
            // Save changes
            try {
                yield session.startTransaction();
                yield userDoc.save();
                yield groupDoc.save();
                yield session.commitTransaction();
            }
            catch (_b) {
                response = {
                    status: response_types_1.ResponseStatus.INTERNAL_SERVER_ERROR,
                    message: 'Error saving user or group'
                };
                yield session.abortTransaction();
            }
            response = {
                status: response_types_1.ResponseStatus.OK,
                message: 'Request answered succesfully'
            };
            yield session.endSession();
            return response;
        });
    }
}
exports.default = new AnswerRequest();
