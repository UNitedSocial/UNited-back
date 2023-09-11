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
const response_types_1 = require("../types/response.types");
const user_service_1 = __importDefault(require("../services/user.service"));
class CreateUser {
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoose_1.default.startSession();
            let response;
            // Check if all info is provided
            if (user.username === undefined || user.name === undefined || user.email === undefined) {
                response = {
                    status: response_types_1.ResponseStatus.BAD_REQUEST,
                    message: 'Missing user info'
                };
                return response;
            }
            // Check if username is already taken
            const exist = yield user_service_1.default.userExists(user.username);
            if (exist) {
                // return user rol in web
                const username = user.username;
                const userDoc = yield User_model_1.default.findOne({ username })
                    .catch((err) => {
                    console.log(err);
                    return null;
                });
                if (userDoc == null) {
                    response = {
                        status: response_types_1.ResponseStatus.INTERNAL_SERVER_ERROR,
                        message: 'Error getting user',
                        answer: { isMaster: false }
                    };
                    return response;
                }
                const isMaster = userDoc === null || userDoc === void 0 ? void 0 : userDoc.isMaster;
                response = {
                    status: response_types_1.ResponseStatus.BAD_REQUEST,
                    message: 'Username already taken',
                    answer: { isMaster }
                };
                return response;
            }
            // Create user and save it
            const newUser = new User_model_1.default(user);
            try {
                yield session.startTransaction();
                yield newUser.save();
                yield session.commitTransaction();
            }
            catch (_a) {
                response = {
                    status: response_types_1.ResponseStatus.INTERNAL_SERVER_ERROR,
                    message: 'Error creating user'
                };
                yield session.abortTransaction();
            }
            response = {
                status: response_types_1.ResponseStatus.CREATED,
                message: 'User created succesfully',
                answer: { isMaster: false }
            };
            yield session.endSession();
            return response;
        });
    }
}
exports.default = new CreateUser();
