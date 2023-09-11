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
const deleteGroup_service_1 = __importDefault(require("../services/deleteGroup.service"));
const getReports_service_1 = __importDefault(require("../services/getReports.service"));
const stateReports_service_1 = __importDefault(require("../services/stateReports.service"));
const deleteReport_service_1 = __importDefault(require("../services/deleteReport.service"));
class WebmastersController {
    // Delete group
    deleteGroup(req, res, _next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get groupname
            const groupname = req.params.groupname;
            // Call service
            const response = yield deleteGroup_service_1.default.deleteGroup(groupname);
            console.log(response.message);
            res.status(response.status).send(response.answer);
        });
    }
    // Get Reports
    getReports(req, res, _next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get params or use default values for groups display
            const index = (req.query.n !== undefined) ? Number(req.query.n) : defaultOptions_config_1.displayOptions.index.n;
            const offset = (req.query.o !== undefined) ? Number(req.query.o) : defaultOptions_config_1.displayOptions.index.offset;
            // Get only the info field
            const response = yield getReports_service_1.default.getReports(index, offset);
            console.log(response.message);
            res.status(response.status).send(response.answer);
        });
    }
    // Get Report State
    stateReports(req, res, _next) {
        return __awaiter(this, void 0, void 0, function* () {
            const description = req.params.description;
            const des = (req.query.des !== undefined) ? Number(req.query.des) : defaultOptions_config_1.displayOptions.des.acept;
            // Get only the info field
            const response = yield stateReports_service_1.default.stateReports(description, des);
            console.log(response.message);
            res.status(response.status).send(response.answer);
        });
    }
    deleteReports(req, res, _next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get params or use default values for groups display
            const reportID = (req.query.report !== undefined) ? req.query.report : 'none';
            // Get only the info field
            const response = yield deleteReport_service_1.default.deleteReport(reportID);
            console.log(response.message);
            res.status(response.status).send({ deleted: response.answer });
        });
    }
}
exports.default = new WebmastersController();
