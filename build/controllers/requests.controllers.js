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
const createRequest_service_1 = __importDefault(require("../services/createRequest.service"));
const getRequests_service_1 = __importDefault(require("../services/getRequests.service"));
const answerRequest_service_1 = __importDefault(require("../services/answerRequest.service"));
class RequestsController {
    // Create a request
    createRequest(req, res, _next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get group and user data
            const groupname = req.params.groupname;
            const { user } = req.body;
            // Call service
            const response = yield createRequest_service_1.default.createRequest(groupname, user.username);
            console.log(response.message);
            res.status(response.status).send({ answer: response.answer, message: response.message });
        });
    }
    // Get requests of an specific group
    getRequests(req, res, _next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get groupname
            const groupname = req.params.groupname;
            // Call service
            const response = yield getRequests_service_1.default.getRequests(groupname);
            console.log(response.message);
            res.status(response.status).send(response.answer);
        });
    }
    // Answer a request
    answerRequest(req, res, _next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get group and user data
            const groupname = req.params.groupname;
            const { username, answer } = req.body;
            // Call service
            const response = yield answerRequest_service_1.default.answerRequest(groupname, username, answer);
            console.log(response.message);
            res.status(response.status).send({ answer: response.answer, message: response.message });
        });
    }
}
exports.default = new RequestsController();
