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
const Report_model_1 = __importDefault(require("../models/Report.model"));
const response_types_1 = require("../types/response.types");
class StateReports {
    stateReports(description, des) {
        return __awaiter(this, void 0, void 0, function* () {
            let response;
            let report = null;
            // Get groups
            try {
                report = yield Report_model_1.default.findOne({ 'reportInfo.description': description }, { _id: 0, __v: 0 });
            }
            catch (_a) {
                response = {
                    status: response_types_1.ResponseStatus.INTERNAL_SERVER_ERROR,
                    message: 'Error finding report'
                };
            }
            // Check if there are resports
            if (report === null) {
                response = {
                    status: response_types_1.ResponseStatus.NOT_FOUND,
                    message: 'The Report doesn\'t exist'
                };
                return response;
            }
            else {
                // Edit the state of the report
                yield Report_model_1.default.updateOne({ 'reportInfo.description': description }, { state: 'closed' });
                if (des === 1) {
                    response = {
                        answer: 'The report is correct',
                        status: response_types_1.ResponseStatus.OK,
                        message: 'The report has been processed'
                    };
                }
                else {
                    response = {
                        answer: 'The report is not correct',
                        status: response_types_1.ResponseStatus.OK,
                        message: 'The report has been processed'
                    };
                }
                return response;
            }
        });
    }
}
exports.default = new StateReports();
