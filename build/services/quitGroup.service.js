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
const mongoose_1 = __importDefault(require("mongoose"));
const Group_model_1 = __importDefault(require("../models/Group.model"));
const User_model_1 = __importDefault(require("../models/User.model"));
const response_types_1 = require("../types/response.types");
const requests_service_1 = __importDefault(require("../services/requests.service"));
class QuitGroup {
    quitGroup(groupname, username) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoose_1.default.startSession();
            let response;
            let groupDoc;
            let userDoc;
            // Get group data
            try {
                groupDoc = yield Group_model_1.default.findOne({ 'info.name': groupname });
                userDoc = yield User_model_1.default.findOne({ username });
            }
            catch (_a) {
                response = {
                    status: response_types_1.ResponseStatus.INTERNAL_SERVER_ERROR,
                    message: 'Error getting group or user'
                };
                return response;
            }
            // Check if group exist
            if (groupDoc == null || userDoc == null) {
                response = {
                    status: response_types_1.ResponseStatus.NOT_FOUND,
                    message: 'Group or User doesn\'t exist'
                };
                return response;
            }
            // Check if user is in group
            if (!requests_service_1.default.userIsInGroup(userDoc, groupDoc)) {
                response = {
                    status: response_types_1.ResponseStatus.BAD_REQUEST,
                    message: 'User isn\'t in the group'
                };
                return response;
            }
            // Delete group from user
            userDoc === null || userDoc === void 0 ? void 0 : userDoc.groups.forEach((group) => {
                if (group.groupName === groupname) {
                    console.log(userDoc === null || userDoc === void 0 ? void 0 : userDoc.groups.indexOf(group));
                    userDoc === null || userDoc === void 0 ? void 0 : userDoc.groups.splice(userDoc === null || userDoc === void 0 ? void 0 : userDoc.groups.indexOf(group), 1);
                }
            });
            // Delete member from group
            groupDoc === null || groupDoc === void 0 ? void 0 : groupDoc.members.forEach((member) => {
                if (member.username === username) {
                    console.log(groupDoc === null || groupDoc === void 0 ? void 0 : groupDoc.members.indexOf(member));
                    groupDoc === null || groupDoc === void 0 ? void 0 : groupDoc.members.splice(groupDoc === null || groupDoc === void 0 ? void 0 : groupDoc.members.indexOf(member), 1);
                }
            });
            // Save changes
            try {
                yield session.startTransaction();
                yield groupDoc.save();
                yield userDoc.save();
                yield session.commitTransaction();
            }
            catch (_b) {
                response = {
                    status: response_types_1.ResponseStatus.INTERNAL_SERVER_ERROR,
                    message: 'Error saving group or user'
                };
                yield session.abortTransaction();
            }
            response = {
                status: response_types_1.ResponseStatus.OK,
                message: 'Quit group successfully'
            };
            yield session.endSession();
            return response;
        });
    }
}
exports.default = new QuitGroup();
