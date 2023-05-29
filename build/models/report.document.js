"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportReasons = exports.ReportUserType = exports.ReportState = exports.ReportType = void 0;
var ReportType;
(function (ReportType) {
    ReportType["reportUser"] = "reportUser";
    ReportType["reportGroup"] = "reportGroup";
    ReportType["reportError"] = "reportError";
    ReportType["feedback"] = "feedback";
})(ReportType = exports.ReportType || (exports.ReportType = {}));
var ReportState;
(function (ReportState) {
    ReportState["pending"] = "pending";
    ReportState["approved"] = "closed";
})(ReportState = exports.ReportState || (exports.ReportState = {}));
var ReportUserType;
(function (ReportUserType) {
    ReportUserType["anonymous"] = "anonymous";
    ReportUserType["registered"] = "registered";
})(ReportUserType = exports.ReportUserType || (exports.ReportUserType = {}));
var ReportReasons;
(function (ReportReasons) {
    ReportReasons["spam"] = "spam";
    ReportReasons["unauthorizedSales"] = "unauthorizedSales";
    ReportReasons["violence"] = "violence";
    ReportReasons["hateSpeech"] = "hateSpeech";
    ReportReasons["falseInformation"] = "falseInformation";
    ReportReasons["harassment"] = "harassment";
    ReportReasons["identityTheft"] = "identityTheft";
    ReportReasons["nudity"] = "nudity";
})(ReportReasons = exports.ReportReasons || (exports.ReportReasons = {}));
