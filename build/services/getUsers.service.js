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
const response_types_1 = require("../types/response.types");
class GetUsers {
    getUsers(index, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            let response;
            let users = [];
            // Get groups
            try {
                users = yield User_model_1.default.find({}, { _id: 0, __v: 0 }, { skip: offset, limit: index });
            }
            catch (_a) {
                response = {
                    status: response_types_1.ResponseStatus.INTERNAL_SERVER_ERROR,
                    message: 'Error finding users'
                };
            }
            // Check if there are groups
            if (users.length === 0) {
                response = {
                    status: response_types_1.ResponseStatus.NOT_FOUND,
                    message: 'There are no users to show'
                };
            }
            else {
                response = {
                    answer: users,
                    status: response_types_1.ResponseStatus.OK,
                    message: 'Users found successfully'
                };
            }
            return response;
        });
    }
}
exports.default = new GetUsers();
