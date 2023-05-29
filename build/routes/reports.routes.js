"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportsRoutes = void 0;
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = __importDefault(require("express"));
const auth0_middlewares_1 = __importDefault(require("../middlewares/auth0.middlewares"));
const users_middlewares_1 = __importDefault(require("../middlewares/users.middlewares"));
const test_controllers_1 = __importDefault(require("../controllers/test.controllers"));
const reports_controllers_1 = __importDefault(require("../controllers/reports.controllers"));
const webmasters_controllers_1 = __importDefault(require("../controllers/webmasters.controllers"));
const router = express_1.default.Router();
// Report routes
router.post('/', auth0_middlewares_1.default.getUserData, users_middlewares_1.default.checkUserExist, reports_controllers_1.default.createReport); // Route to create a report whe user is logged
router.post('/anonymous', users_middlewares_1.default.clearUserData, reports_controllers_1.default.createReport); // Route to create a report when user is not logged
// Webmaster routes
router.get('/', /* auth0Middlewares.getUserData, usersMiddlewares.checkUserExist, usersMiddlewares.checkWebmasterRole, */ webmasters_controllers_1.default.getReports); // Route to get all reports of the system
router.put('/state/:description', auth0_middlewares_1.default.getUserData, users_middlewares_1.default.checkUserExist, users_middlewares_1.default.checkWebmasterRole, webmasters_controllers_1.default.stateReports); // Route to answer a report and inform user
router.delete('/', auth0_middlewares_1.default.getUserData, users_middlewares_1.default.checkUserExist, users_middlewares_1.default.checkWebmasterRole, webmasters_controllers_1.default.deleteReports); // Route to delete report
// Test route
router.get('/test/doomie', test_controllers_1.default.doomie);
exports.reportsRoutes = router;
