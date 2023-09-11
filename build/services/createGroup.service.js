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
const Group_model_1 = __importDefault(require("../models/Group.model"));
const User_model_1 = __importDefault(require("../models/User.model"));
const group_documents_1 = require("../models/group.documents");
const response_types_1 = require("../types/response.types");
const groups_service_1 = __importDefault(require("./groups.service"));
class CreateGroup {
    createGroup(group, username) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoose_1.default.startSession();
            let response;
            let userDoc = null;
            // // Check if all info is provided
            const validate = this.validateGroup(group.info);
            if (group === undefined || group.info === undefined || !validate.valid) {
                response = {
                    status: response_types_1.ResponseStatus.BAD_REQUEST,
                    message: validate.message
                };
                return response;
            }
            // Check is group name is already taken
            const exist = yield groups_service_1.default.groupExists(group.info.name);
            if (exist) {
                response = {
                    status: response_types_1.ResponseStatus.BAD_REQUEST,
                    message: 'Group name already taken'
                };
                return response;
            }
            // Get user info
            try {
                userDoc = yield User_model_1.default.findOne({ username });
            }
            catch (_a) {
                response = {
                    status: response_types_1.ResponseStatus.INTERNAL_SERVER_ERROR,
                    message: 'Error getting user'
                };
            }
            // Check if user exists
            if (userDoc == null) {
                response = {
                    status: response_types_1.ResponseStatus.NOT_FOUND,
                    message: 'User doesn\'t exist'
                };
                return response;
            }
            // Create group and update members
            const newGroup = new Group_model_1.default(group);
            newGroup.info.numberOfMembers = 1;
            newGroup.info.numberOfPublications = 0;
            newGroup.info.creationDate = new Date((0, mongoose_1.now)());
            const member = {
                userId: new mongoose_1.default.Types.ObjectId(userDoc === null || userDoc === void 0 ? void 0 : userDoc._id),
                username: userDoc === null || userDoc === void 0 ? void 0 : userDoc.username,
                name: userDoc === null || userDoc === void 0 ? void 0 : userDoc.name,
                role: 'editor',
                state: 'active'
            };
            newGroup === null || newGroup === void 0 ? void 0 : newGroup.members.push(member);
            // Update groups in user model
            const userGroup = {
                groupId: new mongoose_1.default.Types.ObjectId(group === null || group === void 0 ? void 0 : group._id),
                groupName: group.info.name,
                role: group_documents_1.Role.editor,
                date: new Date((0, mongoose_1.now)())
            };
            userDoc === null || userDoc === void 0 ? void 0 : userDoc.groups.push(userGroup);
            // Save Group and user data
            try {
                yield session.startTransaction();
                yield newGroup.save();
                yield userDoc.save();
                yield session.commitTransaction();
            }
            catch (_b) {
                response = {
                    status: response_types_1.ResponseStatus.INTERNAL_SERVER_ERROR,
                    message: 'Error creating group'
                };
                yield session.abortTransaction();
            }
            response = {
                answer: newGroup,
                status: response_types_1.ResponseStatus.CREATED,
                message: 'Group created successfully'
            };
            yield session.endSession();
            return response;
        });
    }
    validateGroup(info) {
        let message = '';
        let valid = true;
        if (typeof info.name !== 'string' || typeof info.description !== 'string') {
            message += 'Missing group description or group name';
            valid = false;
            return {
                valid,
                message
            };
        }
        if (info.name.length < 5 || info.name.length > 30) {
            message += 'Group name must be at least 5 characters long and less than 30\n';
            valid = false;
        }
        if (info.description.length > 400) {
            message += 'Group description must be less than 400 characters long\n';
            valid = false;
        }
        if (typeof info.contact !== 'object') {
            message += 'Missing contact information\n; contact must have email, phone and social networks\n';
            valid = false;
        }
        else {
            if (typeof info.contact.mail !== 'string' || typeof info.contact.cellphone !== 'string' || typeof info.contact.socialNetworks !== 'object') {
                message += 'Missing email, phone or social networks\n';
                valid = false;
            }
        }
        if (typeof info.isRecognized !== 'boolean') {
            message += 'Missing isRecognized\n';
            valid = false;
        }
        if (!Array.isArray(info.topics)) {
            message += 'Missing topics, if there are no topics, send empty array []\n';
            valid = false;
        }
        return {
            valid,
            message
        };
    }
}
exports.default = new CreateGroup();
