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
const User_model_1 = __importDefault(require("../models/User.model"));
const Group_model_1 = __importDefault(require("../models/Group.model"));
const response_types_1 = require("../types/response.types");
const requests_service_1 = __importDefault(require("./requests.service"));
class CreateRequest {
    createRequest(groupname, username) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoose_1.default.startSession();
            let response;
            let groupDoc;
            let userDoc;
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
            // Validate if user is in the group or has an active request
            if (!requests_service_1.default.validateUserRequest(userDoc, groupDoc)) {
                response = {
                    status: response_types_1.ResponseStatus.BAD_REQUEST,
                    message: 'The user has an active request or is already in the group'
                };
                return response;
            }
            // Create request objects and save them
            const { requestUser, requestGroup } = requests_service_1.default.createRequestObjects(userDoc, groupDoc);
            userDoc.requests.push(requestUser);
            groupDoc.requests.push(requestGroup);
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
                status: response_types_1.ResponseStatus.CREATED,
                message: 'Request created succesfully'
            };
            yield session.endSession();
            return response;
        });
    }
}
exports.default = new CreateRequest();
