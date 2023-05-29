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
const Group_model_1 = __importDefault(require("../models/Group.model"));
const createGroup_service_1 = __importDefault(require("../services/createGroup.service"));
const getGroups_service_1 = __importDefault(require("../services/getGroups.service"));
const seeGroup_service_1 = __importDefault(require("../services/seeGroup.service"));
const editGroup_service_1 = __importDefault(require("../services/editGroup.service"));
const getMembers_service_1 = __importDefault(require("../services/getMembers.service"));
const getTopics_service_1 = __importDefault(require("../services/getTopics.service"));
const changeRole_service_1 = __importDefault(require("../services/changeRole.service"));
const quitGroup_service_1 = __importDefault(require("../services/quitGroup.service"));
const userState_service_1 = __importDefault(require("../services/userState.service"));
const getRelated_service_1 = __importDefault(require("../services/getRelated.service"));
const getRelated2_service_1 = __importDefault(require("../services/getRelated2.service"));
const getNew_service_1 = __importDefault(require("../services/getNew.service"));
const getPopular_service_1 = __importDefault(require("../services/getPopular.service"));
const createSection_service_1 = __importDefault(require("../services/createSection.service"));
const deleteSection_service_1 = __importDefault(require("../services/deleteSection.service"));
const editSection_service_1 = __importDefault(require("../services/editSection.service"));
class GroupsController {
    // Create new group
    createGroup(req, res, _next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get group and user data
            const { group, user } = req.body;
            // Call service
            const response = yield createGroup_service_1.default.createGroup(group, user.username);
            console.log(response.message);
            res.status(response.status).send({ message: response.message, answer: response.answer });
        });
    }
    // Get all groups
    getGroups(req, res, _next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get params or use default values for groups display
            const index = (req.query.n !== undefined) ? Number(req.query.n) : defaultOptions_config_1.displayOptions.index.n;
            const offset = (req.query.o !== undefined) ? Number(req.query.o) : defaultOptions_config_1.displayOptions.index.offset;
            // Get only the info field
            const response = yield getGroups_service_1.default.getGroups(index, offset);
            console.log(response.message);
            res.status(response.status).send(response.answer);
        });
    }
    // Get info of an specific group
    seeGroup(req, res, _next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get groupname
            const groupname = req.params.groupname;
            // Call service
            const response = yield seeGroup_service_1.default.seeGroup(groupname);
            console.log(response.message);
            res.status(response.status).send(response.answer);
        });
    }
    // Edit info of an specific group
    editGroup(req, res, _next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get groupname and group data
            const groupname = req.params.groupname;
            const group = req.body.group;
            // Call service
            const response = yield editGroup_service_1.default.editGroup(groupname, group);
            console.log(response.message);
            res.status(response.status).send({ answer: response.answer, message: response.message });
        });
    }
    // Get members of an specific group
    getMembers(req, res, _next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get groupname
            const groupname = req.params.groupname;
            // Call service
            const response = yield getMembers_service_1.default.getMembers(groupname);
            console.log(response.message);
            res.status(response.status).send(response.answer);
        });
    }
    // Get topics members of an specific group
    getTopics(req, res, _next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get groupname
            const groupname = req.params.groupname;
            // Call service
            const response = yield getTopics_service_1.default.getTopics(groupname);
            console.log(response.message);
            res.status(response.status).send(response.answer);
        });
    }
    // Change role of a user in a group
    changeRole(req, res, _next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get group and user data
            const groupname = req.params.groupname;
            const { username, role } = req.body;
            // Call service
            const response = yield changeRole_service_1.default.changeRole(groupname, username, role);
            console.log(response.message);
            res.status(response.status).send(response.answer);
        });
    }
    // Quit a group
    quitGroup(req, res, _next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get username
            const groupname = req.params.groupname;
            const { user } = req.body;
            // Call service
            const response = yield quitGroup_service_1.default.quitGroup(groupname, user.username);
            console.log(response.message);
            res.status(response.status).send(response.answer);
        });
    }
    // Get user state in group
    userState(req, res, _next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get username and groupname
            const groupname = req.params.groupname;
            const username = req.params.username;
            // Call service
            const response = yield userState_service_1.default.userState(groupname, username);
            console.log(response.message);
            res.status(response.status).send(response.answer);
        });
    }
    // Get most recent created groups
    getNew(req, res, _next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get params or use default values for groups display
            const index = (req.query.n !== undefined) ? Number(req.query.n) : defaultOptions_config_1.displayOptions.index.n;
            const offset = (req.params.page !== undefined) ? Number(req.params.page) : defaultOptions_config_1.displayOptions.index.offset;
            // Call service
            const response = yield getNew_service_1.default.getNew(index, offset);
            console.log(response.message);
            res.status(response.status).send(response.answer);
        });
    }
    // Get most popular groups
    getPopular(req, res, _next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get params or use default values for groups display
            const index = (req.query.n !== undefined) ? Number(req.query.n) : defaultOptions_config_1.displayOptions.index.n;
            const offset = (req.params.page !== undefined) ? Number(req.params.page) : defaultOptions_config_1.displayOptions.index.offset;
            // Call service
            const response = yield getPopular_service_1.default.getPopular(index, offset);
            console.log(response.message);
            res.status(response.status).send(response.answer);
        });
    }
    // Create a section
    createSection(req, res, _next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get group and user data
            const groupname = req.params.groupname;
            const section = req.body.section;
            // Call service
            const response = yield createSection_service_1.default.createSection(groupname, section);
            console.log(response.message);
            res.status(response.status).send(response.answer);
        });
    }
    // Delete a section
    deleteSection(req, res, _next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get group and user data
            const groupname = req.params.groupname;
            const position = (req.query.n !== undefined) ? Number(req.query.n) : 0;
            // Call service
            const response = yield deleteSection_service_1.default.deleteSection(groupname, position);
            console.log(response.message);
            res.status(response.status).send(response.answer);
        });
    }
    // Edit a section
    editSection(req, res, _next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get group and user data
            const groupname = req.params.groupname;
            const position = Number(req.body.position);
            const section = req.body.section;
            // Call service
            const response = yield editSection_service_1.default.editSection(groupname, position, section);
            console.log(response.message);
            res.status(response.status).send(response.answer);
        });
    }
    // Pending to Refactor
    // Get related groups to a group
    getRelated2(req, res, _next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get params or use default values for groups display
            const index = (req.query.n !== undefined) ? Number(req.query.n) : defaultOptions_config_1.displayOptions.index.n;
            const offset = (req.params.page !== undefined) ? Number(req.params.page) : defaultOptions_config_1.displayOptions.index.offset;
            const groupname = req.params.groupname;
            // Call service
            const response = yield getRelated2_service_1.default.getRelated(groupname, index, offset);
            console.log(response.message);
            res.status(response.status).send(response.answer);
        });
    }
    // Function for getting related groups
    getRelated(req, res, _next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get params or use default values for groups display
            const n = (req.query.n !== undefined) ? Number(req.query.n) : defaultOptions_config_1.displayOptions.index.n;
            const offset = (req.query.a !== undefined) ? Number(req.query.a) : defaultOptions_config_1.displayOptions.index.offset;
            const groupname = req.params.groupname;
            // Get group topics
            const group = yield Group_model_1.default.findOne({ 'info.name': groupname }, 'info.topics', { _id: 0, __v: 0 });
            const topics = group === null || group === void 0 ? void 0 : group.info.topics;
            if (topics === undefined) {
                res.status(404).send({ err: 'Group not found' });
                return;
            }
            // Get related groups
            const related = yield getRelated_service_1.default.getRelated(topics, groupname, n, offset).catch((err) => {
                console.log('Error getting related groups', err.message);
                res.status(500).send({ err });
            });
            // Send response
            res.status(200).send(related);
        });
    }
}
exports.default = new GroupsController();
