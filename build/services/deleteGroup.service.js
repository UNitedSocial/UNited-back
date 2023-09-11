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
class DeleteGroup {
    deleteGroup(groupname) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoose_1.default.startSession();
            let response;
            let group = null;
            let user = [];
            // Get group
            try {
                group = yield Group_model_1.default.findOne({ 'info.name': groupname }, { _id: 0, __v: 0 });
            }
            catch (_b) {
                response = {
                    status: response_types_1.ResponseStatus.INTERNAL_SERVER_ERROR,
                    message: 'Error finding group'
                };
                return response;
            }
            // Get group
            try {
                user = yield User_model_1.default.find({ 'groups.groupName': groupname }, { _id: 0, __v: 0 });
            }
            catch (_c) {
                response = {
                    status: response_types_1.ResponseStatus.INTERNAL_SERVER_ERROR,
                    message: 'Error finding user'
                };
                return response;
            }
            // Check if group and user exists
            if (group === null || user === null) {
                response = {
                    status: response_types_1.ResponseStatus.NOT_FOUND,
                    message: 'The Group or User doesn\'t exist'
                };
                return response;
            }
            // Delete the group from the user
            try {
                for (let i = 0; i < user.length; i++) {
                    if (!requests_service_1.default.userIsInGroup(user[i], group)) {
                        response = {
                            status: response_types_1.ResponseStatus.BAD_REQUEST,
                            message: 'User isn\'t in the group'
                        };
                        return response;
                    }
                    (_a = user[i]) === null || _a === void 0 ? void 0 : _a.groups.forEach((group) => {
                        var _a, _b;
                        if (group.groupName === groupname) {
                            (_a = user[i]) === null || _a === void 0 ? void 0 : _a.groups.splice((_b = user[i]) === null || _b === void 0 ? void 0 : _b.groups.indexOf(group), 1);
                        }
                    });
                    const usergroups = user[i].groups;
                    yield User_model_1.default.updateOne({ 'groups.groupName': groupname }, { groups: usergroups });
                }
            }
            catch (_d) {
                response = {
                    status: response_types_1.ResponseStatus.INTERNAL_SERVER_ERROR,
                    message: 'Error deleting group from user'
                };
                return response;
            }
            // Delete the group
            try {
                yield session.startTransaction();
                yield Group_model_1.default.deleteOne({ 'info.name': groupname });
                yield session.commitTransaction();
            }
            catch (_e) {
                response = {
                    status: response_types_1.ResponseStatus.INTERNAL_SERVER_ERROR,
                    message: 'Error deleting group'
                };
                yield session.abortTransaction();
                return response;
            }
            response = {
                status: response_types_1.ResponseStatus.OK,
                message: 'Group deleted successfully'
            };
            yield session.endSession();
            return response;
        });
    }
}
exports.default = new DeleteGroup();
