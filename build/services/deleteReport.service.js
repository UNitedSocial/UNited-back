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
const mongoose_1 = __importDefault(require("mongoose"));
const Report_model_1 = __importDefault(require("../models/Report.model"));
// import { ReportDocument } from '../models/report.document'
const response_types_1 = require("../types/response.types");
class DeleteReport {
    deleteReport(reportID) {
        return __awaiter(this, void 0, void 0, function* () {
            let response;
            if (reportID === 'none') {
                response = {
                    status: response_types_1.ResponseStatus.BAD_REQUEST,
                    message: 'No report ID provided'
                };
                return response;
            }
            // Get groups
            const result = yield Report_model_1.default.findByIdAndDelete(new mongoose_1.default.Types.ObjectId(reportID))
                .catch((err) => {
                console.log(err);
                return null;
            });
            if (result === null) {
                response = {
                    status: response_types_1.ResponseStatus.INTERNAL_SERVER_ERROR,
                    message: 'Error finding reports'
                };
            }
            else {
                response = {
                    status: response_types_1.ResponseStatus.OK,
                    message: 'Report deleted successfully',
                    answer: result
                };
            }
            return response;
        });
    }
}
exports.default = new DeleteReport();
