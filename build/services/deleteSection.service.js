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
const response_types_1 = require("../types/response.types");
class DeleteSection {
    deleteSection(groupname, position) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoose_1.default.startSession();
            let response;
            let groupDoc;
            if (position === 0) {
                response = {
                    status: response_types_1.ResponseStatus.BAD_REQUEST,
                    message: 'Invalid position or missing position'
                };
                return response;
            }
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
            // Check if position is valid
            if (position == null || isNaN(position) || position < 1 || position > groupDoc.page.length) {
                response = {
                    status: response_types_1.ResponseStatus.BAD_REQUEST,
                    message: 'Invalid position or missing position'
                };
                return response;
            }
            // Delete section
            groupDoc.page.forEach((section) => {
                if (section.position === position) {
                    groupDoc === null || groupDoc === void 0 ? void 0 : groupDoc.page.splice(position - 1, 1);
                }
            });
            // // Update positions
            groupDoc.page.forEach((section) => {
                if (section.position > position) {
                    section.position -= 1;
                }
            });
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
                message: 'Section deleted successfully'
            };
            yield session.endSession();
            return response;
        });
    }
}
exports.default = new DeleteSection();
