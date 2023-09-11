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
const createReport_service_1 = __importDefault(require("../services/createReport.service"));
const seeReports_service_1 = __importDefault(require("../services/seeReports.service"));
class ReportsController {
    // Create new report
    createReport(req, res, _next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get report data
            const username = (req.body.user.username !== undefined) ? req.body.user.username : defaultOptions_config_1.displayOptions.report.anonymous;
            const { report } = req.body;
            // Call service
            const response = yield createReport_service_1.default.createReport(username, report);
            console.log(response.message);
            res.status(response.status).send(response.answer);
        });
    }
    // See reports
    seeReports(req, res, _next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get params or use default values for users display
            const index = (req.query.n !== undefined) ? Number(req.query.n) : defaultOptions_config_1.displayOptions.index.n;
            const offset = (req.query.o !== undefined) ? Number(req.query.o) : defaultOptions_config_1.displayOptions.index.offset;
            const username = req.params.username;
            // Call service
            const response = yield seeReports_service_1.default.seeReports(username, index, offset);
            console.log(response.message);
            res.status(response.status).send(response.answer);
        });
    }
}
exports.default = new ReportsController();
