"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const report_document_1 = require("./report.document");
const ReportingUserSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'Users' },
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true }
});
const ReportSchema = new mongoose_1.Schema({
    reportType: { type: String, required: true },
    reportInfo: { type: mongoose_1.Schema.Types.Mixed, required: true },
    userType: { type: String, required: true },
    reportingUser: { type: ReportingUserSchema, required: false },
    date: { type: Date, required: true, default: Date.now },
    closedDate: { type: Date, required: false },
    state: { type: String, required: true, default: report_document_1.ReportState.pending },
    masterComment: { type: String, required: false }
});
exports.default = (0, mongoose_1.model)('Report', ReportSchema);
