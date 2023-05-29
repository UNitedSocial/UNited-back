"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchRoutes = void 0;
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = __importDefault(require("express"));
const test_controllers_1 = __importDefault(require("../controllers/test.controllers"));
const search_controllers_1 = __importDefault(require("../controllers/search.controllers"));
const router = express_1.default.Router();
// Search routes
router.get('/:query', search_controllers_1.default.searchGroups); // Route to get groups using search engine
// Test route
router.get('/test/doomie', test_controllers_1.default.doomie);
exports.searchRoutes = router;
