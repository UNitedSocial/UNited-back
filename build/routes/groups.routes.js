"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupsRoutes = void 0;
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = __importDefault(require("express"));
const auth0_middlewares_1 = __importDefault(require("../middlewares/auth0.middlewares"));
const users_middlewares_1 = __importDefault(require("../middlewares/users.middlewares"));
const groups_Middlewares_1 = __importDefault(require("../middlewares/groups.Middlewares"));
const test_controllers_1 = __importDefault(require("../controllers/test.controllers"));
const groups_controllers_1 = __importDefault(require("../controllers/groups.controllers"));
const requests_controllers_1 = __importDefault(require("../controllers/requests.controllers"));
const webmasters_controllers_1 = __importDefault(require("../controllers/webmasters.controllers"));
const router = express_1.default.Router();
// Group routes
router.post('/', auth0_middlewares_1.default.getUserData, users_middlewares_1.default.checkUserExist, groups_controllers_1.default.createGroup); // Route for create a group
router.get('/', groups_controllers_1.default.getGroups); // Route to get info of all groups
router.get('/:groupname', groups_controllers_1.default.seeGroup); // Route to get info of an specific group
router.put('/:groupname', auth0_middlewares_1.default.getUserData, users_middlewares_1.default.checkUserExist, groups_Middlewares_1.default.checkGroupRole, groups_controllers_1.default.editGroup); // Route to edit info of an specific group
router.delete('/:groupname', auth0_middlewares_1.default.getUserData, users_middlewares_1.default.checkUserExist, groups_Middlewares_1.default.checkGroupRole, webmasters_controllers_1.default.deleteGroup); // Route to delete a group
router.get('/:groupname/members', groups_controllers_1.default.getMembers); // Route to get the members of an specific group
router.get('/:groupname/topics', groups_controllers_1.default.getTopics); // Route to get the topics of an specific group
router.put('/:groupname/changeRole', auth0_middlewares_1.default.getUserData, users_middlewares_1.default.checkUserExist, groups_Middlewares_1.default.checkGroupRole, groups_controllers_1.default.changeRole); // Route to change role of a member
router.put('/:groupname/quitGroup', auth0_middlewares_1.default.getUserData, users_middlewares_1.default.checkUserExist, groups_controllers_1.default.quitGroup); // Route to quit a group
// Related, new and popular groups routes
router.get('/:groupname/related', groups_controllers_1.default.getRelated); // Route to get groups related to an specific group
router.get('/:page/new', groups_controllers_1.default.getNew); // Route to get most recent created groups
router.get('/:page/popular', groups_controllers_1.default.getPopular); // Route to get the groups with more members
// Sections routes
router.post('/:groupname/sections', auth0_middlewares_1.default.getUserData, users_middlewares_1.default.checkUserExist, groups_Middlewares_1.default.checkGroupRole, groups_controllers_1.default.createSection); // Route to create a section in a group page
router.delete('/:groupname/sections', auth0_middlewares_1.default.getUserData, users_middlewares_1.default.checkUserExist, groups_Middlewares_1.default.checkGroupRole, groups_controllers_1.default.deleteSection); // Route to delete a section of a group page
router.put('/:groupname/sections', auth0_middlewares_1.default.getUserData, users_middlewares_1.default.checkUserExist, groups_Middlewares_1.default.checkGroupRole, groups_controllers_1.default.editSection); // Route to edit a section of a group page
// Requests routes
router.post('/:groupname/requests', auth0_middlewares_1.default.getUserData, users_middlewares_1.default.checkUserExist, requests_controllers_1.default.createRequest); // Route to create a request to join a group
router.get('/:groupname/requests', auth0_middlewares_1.default.getUserData, users_middlewares_1.default.checkUserExist, groups_Middlewares_1.default.checkGroupRole, requests_controllers_1.default.getRequests); // Route to get all join requests of a group
router.put('/:groupname/requests', auth0_middlewares_1.default.getUserData, users_middlewares_1.default.checkUserExist, groups_Middlewares_1.default.checkGroupRole, requests_controllers_1.default.answerRequest); // Route to answer a join request in a group
// Webmaster routes
router.get('/:groupname/:username', groups_controllers_1.default.userState); // Route for get state of a user in a group
// Test route
router.get('/test/doomie', test_controllers_1.default.doomie);
exports.groupsRoutes = router;
