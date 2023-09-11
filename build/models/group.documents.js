"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestState = exports.MemberState = exports.Role = exports.StyleList = exports.SectionTypes = exports.Classification = exports.RecognizedInfoType = void 0;
// Info of types
var RecognizedInfoType;
(function (RecognizedInfoType) {
    RecognizedInfoType["hotbed"] = "Semillero";
    RecognizedInfoType["group"] = "Grupo estudiantil";
    RecognizedInfoType["project"] = "Proyecto estudiantil";
})(RecognizedInfoType = exports.RecognizedInfoType || (exports.RecognizedInfoType = {}));
var Classification;
(function (Classification) {
    Classification["academic"] = "Acad\u00E9mico";
    Classification["cultural"] = "Cultural";
    Classification["leisure"] = "Ocio";
    Classification["other"] = "Otro";
})(Classification = exports.Classification || (exports.Classification = {}));
// Page types
var SectionTypes;
(function (SectionTypes) {
    SectionTypes["carousel"] = "carousel";
    SectionTypes["title"] = "title";
    SectionTypes["subtitle"] = "subtitle";
    SectionTypes["paragraphs"] = "paragraphs";
    SectionTypes["list"] = "list";
})(SectionTypes = exports.SectionTypes || (exports.SectionTypes = {}));
var StyleList;
(function (StyleList) {
    StyleList["ordered"] = "ordered";
    StyleList["unordered"] = "unordered";
})(StyleList = exports.StyleList || (exports.StyleList = {}));
// Group types
var Role;
(function (Role) {
    Role["editor"] = "editor";
    Role["member"] = "member";
})(Role = exports.Role || (exports.Role = {}));
var MemberState;
(function (MemberState) {
    MemberState["active"] = "active";
    MemberState["inactive"] = "inactive";
})(MemberState = exports.MemberState || (exports.MemberState = {}));
var RequestState;
(function (RequestState) {
    RequestState["approved"] = "approved";
    RequestState["rejected"] = "rejected";
    RequestState["pending"] = "pending";
})(RequestState = exports.RequestState || (exports.RequestState = {}));
