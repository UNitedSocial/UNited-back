"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const mongoose_1 = __importStar(require("mongoose"));
const User_model_1 = __importDefault(require("../models/User.model"));
const Group_model_1 = __importDefault(require("../models/Group.model"));
const Report_model_1 = __importDefault(require("../models/Report.model"));
const report_document_1 = require("../models/report.document");
const response_types_1 = require("../types/response.types");
class CreateReport {
    createReport(username, report) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoose_1.default.startSession();
            let response;
            let userDoc = null;
            // Check if all the report information is provided
            if (report === undefined || report.reportType === undefined || report.reportInfo === undefined) {
                response = {
                    status: response_types_1.ResponseStatus.BAD_REQUEST,
                    message: 'Missing report information'
                };
                return response;
            }
            // Get user
            try {
                userDoc = yield User_model_1.default.findOne({ username }, { __v: 0 });
            }
            catch (_a) {
                response = {
                    status: response_types_1.ResponseStatus.INTERNAL_SERVER_ERROR,
                    message: 'Error finding user'
                };
            }
            // Check if the user exists and assign the user type and data
            if (userDoc === null) {
                report.userType = report_document_1.ReportUserType.anonymous;
            }
            else {
                report.userType = report_document_1.ReportUserType.registered;
                const reportingUser = {
                    userId: userDoc._id,
                    name: userDoc.name,
                    username: userDoc.username,
                    email: userDoc.email
                };
                report.reportingUser = reportingUser;
            }
            // Select report type and try to create the report
            let newReport;
            switch (report.reportType) {
                case 'reportUser':
                    try {
                        newReport = yield this.createUserReport(report);
                    }
                    catch (_b) {
                        response = {
                            status: response_types_1.ResponseStatus.BAD_REQUEST,
                            message: 'Error creating report'
                        };
                        return response;
                    }
                    break;
                case 'reportGroup':
                    try {
                        newReport = yield this.createGroupReport(report);
                    }
                    catch (_c) {
                        response = {
                            status: response_types_1.ResponseStatus.BAD_REQUEST,
                            message: 'Error creating report'
                        };
                        return response;
                    }
                    break;
                case 'reportError':
                    try {
                        newReport = yield this.createErrorReport(report);
                    }
                    catch (_d) {
                        response = {
                            status: response_types_1.ResponseStatus.BAD_REQUEST,
                            message: 'Error creating report'
                        };
                        return response;
                    }
                    break;
                case 'feedback':
                    try {
                        newReport = yield this.createFeedback(report);
                    }
                    catch (_e) {
                        response = {
                            status: response_types_1.ResponseStatus.BAD_REQUEST,
                            message: 'Error creating report'
                        };
                        return response;
                    }
                    break;
                default:
                    response = {
                        status: response_types_1.ResponseStatus.BAD_REQUEST,
                        message: 'Report type doesn\'t exist'
                    };
                    return response;
            }
            // Save the report
            try {
                yield session.startTransaction();
                yield newReport.save();
                yield session.commitTransaction();
            }
            catch (_f) {
                response = {
                    status: response_types_1.ResponseStatus.BAD_REQUEST,
                    message: 'Error saving report'
                };
                yield session.abortTransaction();
            }
            response = {
                status: response_types_1.ResponseStatus.OK,
                message: 'Report created successfully'
            };
            return response;
        });
    }
    createUserReport(report) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if data is provided correctly
            const reportInfo = report.reportInfo;
            if (reportInfo.user === undefined || reportInfo.reason === undefined || reportInfo.description === undefined) {
                console.log('Missing report information');
                throw new Error();
            }
            // Get reported user
            let userDoc = null;
            try {
                userDoc = yield User_model_1.default.findOne({ username: reportInfo.user.username }, { __v: 0 });
            }
            catch (_a) {
                console.log('Error finding group');
                throw new Error();
            }
            // Check if the user exists and assign the user data
            if (userDoc === null) {
                console.log('User doesn\'t exist');
                throw new Error();
            }
            else {
                const reportedUser = {
                    userId: userDoc._id,
                    name: userDoc.name,
                    username: userDoc.username,
                    email: userDoc.email
                };
                reportInfo.user = reportedUser;
            }
            // Create the report
            report.reportInfo = reportInfo;
            report.date = new Date((0, mongoose_1.now)());
            report.state = report_document_1.ReportState.pending;
            const newReport = new Report_model_1.default(report);
            console.log('User report created');
            return newReport;
        });
    }
    createGroupReport(report) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if data is provided correctly
            const reportInfo = report.reportInfo;
            if (reportInfo.group === undefined || reportInfo.reason === undefined || reportInfo.description === undefined) {
                console.log('Missing report information');
                throw new Error();
            }
            // Get reported group
            let groupDoc = null;
            try {
                groupDoc = yield Group_model_1.default.findOne({ 'info.name': reportInfo.group.groupName }, { __v: 0 });
            }
            catch (_a) {
                console.log('Error finding group');
                throw new Error();
            }
            // Check if the group exists and assign the group data
            if (groupDoc === null) {
                console.log('Group doesn\'t exist');
                throw new Error();
            }
            else {
                const reportedGroup = {
                    groupId: groupDoc._id,
                    groupName: groupDoc.info.name
                };
                reportInfo.group = reportedGroup;
            }
            // Create the report
            report.reportInfo = reportInfo;
            report.date = new Date((0, mongoose_1.now)());
            report.state = report_document_1.ReportState.pending;
            const newReport = new Report_model_1.default(report);
            console.log('Group report created');
            return newReport;
        });
    }
    createErrorReport(report) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if data is provided correctly
            const reportInfo = report.reportInfo;
            if (reportInfo.page === undefined || reportInfo.description === undefined) {
                console.log('Missing report information');
                throw new Error();
            }
            // Create the report
            report.reportInfo = reportInfo;
            report.date = new Date((0, mongoose_1.now)());
            report.state = report_document_1.ReportState.pending;
            const newReport = new Report_model_1.default(report);
            console.log('Error report created');
            return newReport;
        });
    }
    createFeedback(report) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if data is provided correctly
            const reportInfo = report.reportInfo;
            if (reportInfo.description === undefined) {
                console.log('Missing report information');
                throw new Error();
            }
            // Create the report
            report.reportInfo = reportInfo;
            report.date = new Date((0, mongoose_1.now)());
            report.state = report_document_1.ReportState.pending;
            const newReport = new Report_model_1.default(report);
            console.log('Feedback created');
            return newReport;
        });
    }
}
exports.default = new CreateReport();
