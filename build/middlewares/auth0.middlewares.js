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
Object.defineProperty(exports, "__esModule", { value: true });
const express_oauth2_jwt_bearer_1 = require("express-oauth2-jwt-bearer");
class Auth0Middlewares {
    constructor() {
        this.verifyJwt = (0, express_oauth2_jwt_bearer_1.auth)({
            audience: process.env.AUTH0AUDIENCE,
            issuerBaseURL: process.env.AUTH0DOMAIN,
            tokenSigningAlg: process.env.AUTH0ALGORITHM
        });
    }
    doom(_req, res, _next) {
        return __awaiter(this, void 0, void 0, function* () {
            res.status(200).json({ message: 'Doomed' });
        });
    }
    getUserData(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (req.headers.authorization === undefined) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            const accessToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            fetch('https://dev-nj72nakbgyv4edeo.us.auth0.com/userinfo', {
                headers: {
                    Authorization: `Bearer ${accessToken === undefined ? '' : accessToken}`
                }
            }).then((response) => __awaiter(this, void 0, void 0, function* () {
                var _b;
                void ((_b = response.json()) === null || _b === void 0 ? void 0 : _b.then((data) => {
                    data.username = data.nickname;
                    req.body.user = data;
                    next();
                }).catch((err) => {
                    res.status(500).json({ message: err.message });
                }));
            })).catch((err) => {
                res.status(500).json({ message: err.message });
            });
        });
    }
}
exports.default = new Auth0Middlewares();
