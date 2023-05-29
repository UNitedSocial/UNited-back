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
const group_documents_1 = require("../models/group.documents");
const response_types_1 = require("../types/response.types");
class CreateSection {
    createSection(groupname, section) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoose_1.default.startSession();
            let response;
            let groupDoc;
            // Get group data
            try {
                groupDoc = yield Group_model_1.default.findOne({ 'info.name': groupname });
            }
            catch (_a) {
                response = {
                    status: response_types_1.ResponseStatus.INTERNAL_SERVER_ERROR,
                    message: 'Error getting group'
                };
                return response;
            }
            // Check if group exist
            if (groupDoc == null) {
                response = {
                    status: response_types_1.ResponseStatus.NOT_FOUND,
                    message: 'Group doesn\'t exist'
                };
                return response;
            }
            // Check section properties
            if (section == null || section.type == null || section.content == null) {
                response = {
                    status: response_types_1.ResponseStatus.BAD_REQUEST,
                    message: 'Section wasn\'t sent or properties are missing'
                };
                return response;
            }
            // Check section type
            if (section.type !== group_documents_1.SectionTypes.carousel && section.type !== group_documents_1.SectionTypes.list && section.type !== group_documents_1.SectionTypes.paragraphs && section.type !== group_documents_1.SectionTypes.subtitle && section.type !== group_documents_1.SectionTypes.title) {
                response = {
                    status: response_types_1.ResponseStatus.BAD_REQUEST,
                    message: 'Section type doesn\'t exist'
                };
                return response;
            }
            // Assign position
            section.position = groupDoc.page.length + 1;
            groupDoc.page.push(section);
            // Save changes
            try {
                yield session.startTransaction();
                yield groupDoc.save();
                yield session.commitTransaction();
            }
            catch (_b) {
                response = {
                    status: response_types_1.ResponseStatus.INTERNAL_SERVER_ERROR,
                    message: 'Error saving group'
                };
                yield session.abortTransaction();
            }
            response = {
                status: response_types_1.ResponseStatus.CREATED,
                message: 'Section created successfully'
            };
            yield session.endSession();
            return response;
        });
    }
}
exports.default = new CreateSection();
