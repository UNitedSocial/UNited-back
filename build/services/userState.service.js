"use strict";
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
const User_model_1 = __importDefault(require("../models/User.model"));
const Group_model_1 = __importDefault(require("../models/Group.model"));
const response_types_1 = require("../types/response.types");
class UserState {
    userState(groupname, username) {
        return __awaiter(this, void 0, void 0, function* () {
            let response;
            let userDoc = null;
            let groupDoc = null;
            // Get groups
            try {
                userDoc = yield User_model_1.default.findOne({ username }, { _id: 0, __v: 0 });
                groupDoc = yield Group_model_1.default.findOne({ 'info.name': groupname }, { _id: 0, __v: 0 });
            }
            catch (_a) {
                response = {
                    status: response_types_1.ResponseStatus.INTERNAL_SERVER_ERROR,
                    message: 'Error finding user or group'
                };
            }
            // Check if group and user exist
            if (userDoc == null || groupDoc == null) {
                response = {
                    status: response_types_1.ResponseStatus.NOT_FOUND,
                    message: 'The User or group doesn\'t exist'
                };
                return response;
            }
            // Default response if user doesn't belong to group
            let state = 'doesn\'t belong';
            response = {
                answer: state,
                status: response_types_1.ResponseStatus.OK,
                message: 'User doesn\'t belong to group'
            };
            // Check if user has pending request
            userDoc.requests.forEach(request => {
                if (request.groupName === groupname && request.state === 'pending') {
                    state = 'pending';
                    response = {
                        answer: state,
                        status: response_types_1.ResponseStatus.OK,
                        message: 'Pending request'
                    };
                }
            });
            // Check if user belongs to group
            groupDoc.members.forEach(member => {
                if (member.username === username) {
                    if (member.role === 'editor') {
                        state = 'editor';
                    }
                    else {
                        state = 'member';
                    }
                    response = {
                        answer: state,
                        status: response_types_1.ResponseStatus.OK,
                        message: 'User belongs to group'
                    };
                }
            });
            return response;
        });
    }
}
exports.default = new UserState();
