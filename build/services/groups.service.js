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
exports.GroupService = void 0;
const Group_model_1 = __importDefault(require("../models/Group.model"));
class GroupService {
    groupExists(groupName) {
        return __awaiter(this, void 0, void 0, function* () {
            // check if group exist
            const group = yield Group_model_1.default.findOne({ 'info.name': groupName })
                .catch((err) => {
                console.log(err);
                return false;
            });
            if (group != null) {
                return true;
            }
            else {
                return false;
            }
        });
    }
    getGroupRole(groupName, _username) {
        return __awaiter(this, void 0, void 0, function* () {
            let role = null;
            const groupMembers = yield Group_model_1.default.findOne({ 'info.name': groupName }, 'members')
                .then((group) => {
                if (group != null) {
                    return group.members;
                }
                else {
                    console.log('Group not found');
                    return null;
                }
            })
                .catch((err) => {
                console.log(err);
                return role;
            });
            if (groupMembers === null || typeof groupMembers === 'string' || groupMembers instanceof String) {
                return role;
            }
            groupMembers === null || groupMembers === void 0 ? void 0 : groupMembers.forEach((member) => {
                if (member.username === _username) {
                    role = member.role;
                }
            });
            if (role === null) {
                return 'not belongs';
            }
            return role;
        });
    }
}
exports.GroupService = GroupService;
exports.default = new GroupService();
