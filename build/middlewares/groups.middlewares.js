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
const groups_service_1 = __importDefault(require("../services/groups.service"));
const group_documents_1 = require("../models/group.documents");
class GroupMiddlewares {
    checkGroupExist(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // get and check username is given
            const { group } = req.body;
            const groupName = group === null || group === void 0 ? void 0 : group.info.name;
            if (groupName === undefined) {
                res.status(400).json({ message: 'Missing group name' });
                console.log('Missing group name');
                return;
            }
            // check if user exist
            const groupExists = yield groups_service_1.default.groupExists(groupName);
            if (groupExists) {
                next();
            }
            else {
                res.status(400).json({ message: 'Group do not exists' });
                console.log('Group do not exists');
            }
        });
    }
    checkGroupRole(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const groupName = req.params.groupname;
            const { user } = req.body;
            const username = user === null || user === void 0 ? void 0 : user.username;
            if (groupName === undefined || username === undefined) {
                res.status(400).json({ message: 'Missing group name or username' });
                console.log('Missing group name or username');
                return;
            }
            const role = yield groups_service_1.default.getGroupRole(groupName, username);
            if (role === group_documents_1.Role.editor) {
                next();
            }
            else if (role === group_documents_1.Role.member) {
                res.status(400).json({ message: 'User isn\'t an editor' });
                console.log('User isn\'t an editor');
            }
            else if (role === 'not belongs') {
                res.status(400).json({ message: 'User doesn\'t belong to group' });
                console.log('User doesn\'t belong to group');
            }
            else if (role === null) {
                res.status(404).json({ message: 'Group not found' });
            }
            else {
                res.status(500).json({ message: 'error' });
                console.log('error');
            }
        });
    }
}
exports.default = new GroupMiddlewares();
