"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationRouter = void 0;
const express_1 = __importDefault(require("express"));
const hello_routes_1 = require("./hello.routes");
const groups_routes_1 = require("./groups.routes");
const users_routes_1 = require("./users.routes");
const search_routes_1 = require("./search.routes");
const reports_routes_1 = require("./reports.routes");
const router = express_1.default.Router();
// Get all routes
router.use('/api', hello_routes_1.helloRoutes); // For testing new functionalities
router.use('/groups', groups_routes_1.groupsRoutes);
router.use('/users', users_routes_1.usersRoutes);
router.use('/search', search_routes_1.searchRoutes);
router.use('/reports', reports_routes_1.reportsRoutes);
exports.applicationRouter = router;
