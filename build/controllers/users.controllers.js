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
const defaultOptions_config_1 = require("../config/defaultOptions.config");
const createUser_service_1 = __importDefault(require("../services/createUser.service"));
const getUsers_service_1 = __importDefault(require("../services/getUsers.service"));
const seeUser_service_1 = __importDefault(require("../services/seeUser.service"));
const deleteUser_service_1 = __importDefault(require("../services/deleteUser.service"));
class UserController {
    // Create new user
    createUser(req, res, _next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get user data
            const { user } = req.body;
            // Call service
            const response = yield createUser_service_1.default.createUser(user);
            console.log(response.message);
            res.status(response.status).send(response.answer);
        });
    }
    // Get all users
    getUsers(req, res, _next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get params or use default values for users display
            const index = (req.query.n !== undefined) ? Number(req.query.n) : defaultOptions_config_1.displayOptions.index.n;
            const offset = (req.query.o !== undefined) ? Number(req.query.o) : defaultOptions_config_1.displayOptions.index.offset;
            // Call service
            const response = yield getUsers_service_1.default.getUsers(index, offset);
            console.log(response.message);
            res.status(response.status).send(response.answer);
        });
    }
    // Get info of an specific user
    seeUser(req, res, _next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get username
            const username = req.params.username;
            // Call service
            const response = yield seeUser_service_1.default.seeUser(username);
            console.log(response.message);
            res.status(response.status).send(response.answer);
        });
    }
    deleteUser(req, res, _next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get username
            const username = req.params.username;
            // Call service
            const response = yield deleteUser_service_1.default.deleteUser(username);
            console.log(response.message);
            res.status(response.status).send(response.answer);
        });
    }
}
exports.default = new UserController();
