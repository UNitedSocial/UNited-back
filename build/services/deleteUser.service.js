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
class DeleteUser {
    deleteUser(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoose_1.default.startSession();
            let response;
            let group = [];
            let user = null;
            // Get group
            try {
                user = yield User_model_1.default.findOne({ username }, { _id: 0, __v: 0 });
            }
            catch (_a) {
                response = {
                    status: response_types_1.ResponseStatus.INTERNAL_SERVER_ERROR,
                    message: 'Error finding user'
                };
                return response;
            }
            // Get group
            try {
                group = yield Group_model_1.default.find({ 'members.username': username }, { _id: 0, __v: 0 });
            }
            catch (_b) {
                response = {
                    status: response_types_1.ResponseStatus.INTERNAL_SERVER_ERROR,
                    message: 'Error finding group'
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
            // Delete the user from the group
            try {
                for (let i = 0; i < group.length; i++) {
                    if (!requests_service_1.default.userIsInGroup(user, group[i])) {
                        response = {
                            status: response_types_1.ResponseStatus.BAD_REQUEST,
                            message: 'User isn\'t in the group'
                        };
                        return response;
                    }
                    group[i].members.forEach((member) => {
                        var _a, _b, _c;
                        if (member.username === username) {
                            console.log((_a = group[i]) === null || _a === void 0 ? void 0 : _a.members.indexOf(member));
                            (_b = group[i]) === null || _b === void 0 ? void 0 : _b.members.splice((_c = group[i]) === null || _c === void 0 ? void 0 : _c.members.indexOf(member), 1);
                        }
                    });
                    const usergroups = group[i].members;
                    const nuevoValor = group[i].info.numberOfMembers - 1;
                    yield Group_model_1.default.updateOne({ 'members.username': username }, {
                        members: usergroups,
                        'info.numberOfMembers': nuevoValor
                    });
                }
            }
            catch (_c) {
                response = {
                    status: response_types_1.ResponseStatus.INTERNAL_SERVER_ERROR,
                    message: 'Error deleting group from user'
                };
                return response;
            }
            // Delete the USER
            try {
                yield session.startTransaction();
                yield User_model_1.default.deleteOne({ username });
                yield session.commitTransaction();
            }
            catch (_d) {
                response = {
                    status: response_types_1.ResponseStatus.INTERNAL_SERVER_ERROR,
                    message: 'Error deleting user'
                };
                yield session.abortTransaction();
            }
            response = {
                status: response_types_1.ResponseStatus.OK,
                message: 'User deleted successfully'
            };
            yield session.endSession();
            return response;
        });
    }
}
exports.default = new DeleteUser();
