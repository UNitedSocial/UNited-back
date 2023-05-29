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
const searchGroups_service_1 = __importDefault(require("../services/searchGroups.service"));
class SearchController {
    // Search groups
    searchGroups(req, res, _next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get params or use default values for groups display
            const query = req.params.query;
            const order = (req.query.ord !== undefined) ? req.query.ord : defaultOptions_config_1.displayOptions.search.ord;
            const descending = (req.query.des !== undefined) ? req.query.des : defaultOptions_config_1.displayOptions.search.des;
            const filter = (req.query.fil !== undefined) ? req.query.fil : defaultOptions_config_1.displayOptions.search.fil;
            const value = (req.query.val !== undefined) ? req.query.val : defaultOptions_config_1.displayOptions.search.val;
            // Call service
            const response = yield searchGroups_service_1.default.searchGroups(query, order, descending, filter, value);
            console.log(response.message);
            res.status(response.status).send(response.answer);
        });
    }
}
exports.default = new SearchController();
