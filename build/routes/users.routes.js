"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRoutes = void 0;
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = __importDefault(require("express"));
const auth0_middlewares_1 = __importDefault(require("../middlewares/auth0.middlewares"));
const test_controllers_1 = __importDefault(require("../controllers/test.controllers"));
const users_controllers_1 = __importDefault(require("../controllers/users.controllers"));
const reports_controllers_1 = __importDefault(require("../controllers/reports.controllers"));
const router = express_1.default.Router();
// Users routes
router.post('/', auth0_middlewares_1.default.getUserData, users_controllers_1.default.createUser); // Route for create an user
router.get('/', users_controllers_1.default.getUsers); // Route to get info of all users
router.get('/:username', users_controllers_1.default.seeUser); // Route to get info of an specific user
router.delete('/:username', users_controllers_1.default.deleteUser); // Route to get info of an specific user
router.get('/:username/reports', reports_controllers_1.default.seeReports); // Route to get reports of an specicific user
// Test route
router.get('/test/doomie', test_controllers_1.default.doomie);
exports.usersRoutes = router;
