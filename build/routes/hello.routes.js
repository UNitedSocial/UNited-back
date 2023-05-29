"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.helloRoutes = void 0;
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = __importDefault(require("express"));
const users_middlewares_1 = __importDefault(require("../middlewares/users.middlewares"));
const groups_Middlewares_1 = __importDefault(require("../middlewares/groups.Middlewares"));
const reports_controllers_1 = __importDefault(require("../controllers/reports.controllers"));
const router = express_1.default.Router();
// Test Route
router.get('/CheckUser', users_middlewares_1.default.checkUserExist, (req, res) => res.send(`Hello World! ${req.body.user.nickname in [null, undefined] ? 'no username' : req.body.user.nickname}`));
router.get('/CheckGroup/:groupname', groups_Middlewares_1.default.checkGroupRole, (_req, res) => res.send('Hello World!'));
router.post('/newReport', reports_controllers_1.default.createReport); // testing models
exports.helloRoutes = router;
