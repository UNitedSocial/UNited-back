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
const Group_model_1 = __importDefault(require("../models/Group.model"));
const response_types_1 = require("../types/response.types");
class SearchGroups {
    searchGroups(query, order, descending, filter, value) {
        return __awaiter(this, void 0, void 0, function* () {
            let response;
            let groups = [];
            // Convert query to RegExp
            const reg = new RegExp(query, 'i');
            // Order groups
            switch (order) {
                case 'date':
                    order = 'info.creationDate';
                    break;
                case 'members':
                    order = 'info.numberOfMembers';
                    break;
                case 'publications':
                    order = 'info.numberOfPublications';
                    break;
                default:
                    order = 'info.name';
                    break;
            }
            // Filter groups
            switch (filter) {
                case 'topics':
                    filter = 'info.topics';
                    if (value === '0') {
                        filter = 'info.isRecognized';
                        value = 'true-false';
                    }
                    break;
                case 'classification':
                    filter = 'info.clasification';
                    if (value === '0') {
                        filter = 'info.isRecognized';
                        value = 'true-false';
                    }
                    break;
                case 'members':
                    filter = 'info.numberOfMembers';
                    break;
                case 'date':
                    filter = 'info.creationDate';
                    break;
                case 'recognized':
                    filter = 'info.isRecognized';
                    if (value === '0') {
                        filter = 'info.isRecognized';
                        value = 'true-false';
                    }
                    break;
                default:
                    filter = 'info.isRecognized';
                    value = 'true-false';
            }
            // Ascending or descending order
            let des = 1;
            if (descending === 'yes') {
                des = -1;
            }
            // Get groups
            if (filter === 'info.numberOfMembers' || filter === 'info.creationDate') {
                try {
                    groups = yield Group_model_1.default.find({ $and: [{ 'info.name': { $regex: reg } }, { [filter]: { $gte: value } }] }, { info: 1, _id: 0 }).sort([[order, des]]);
                }
                catch (_a) {
                    response = {
                        status: response_types_1.ResponseStatus.INTERNAL_SERVER_ERROR,
                        message: 'Error finding groups'
                    };
                }
            }
            else {
                const newValue = value.split('-');
                try {
                    groups = yield Group_model_1.default.find({ $and: [{ 'info.name': { $regex: reg } }, { [filter]: { $in: newValue } }] }, { info: 1, _id: 0 }).sort([[order, des]]);
                }
                catch (_b) {
                    response = {
                        status: response_types_1.ResponseStatus.INTERNAL_SERVER_ERROR,
                        message: 'Error finding groups'
                    };
                }
            }
            // Check if there are groups
            if (groups.length === 0) {
                response = {
                    answer: groups,
                    status: response_types_1.ResponseStatus.OK,
                    message: 'There are no groups with that search'
                };
            }
            else {
                response = {
                    answer: groups,
                    status: response_types_1.ResponseStatus.OK,
                    message: 'Search found groups successfully'
                };
            }
            return response;
        });
    }
}
exports.default = new SearchGroups();
