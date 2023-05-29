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
const user_service_1 = __importDefault(require("../services/user.service"));
class UserMiddlewares {
    checkUserExist(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get user
            const { user } = req.body;
            // Check if info is given
            if (user === undefined || user.username === undefined) {
                res.status(400).json({ message: 'Missing user information' });
                console.log('Missing user information');
                return;
            }
            // Check if user exist
            const userExists = yield user_service_1.default.userExists(user.username);
            if (userExists) {
                next();
            }
            else {
                res.status(401).json({ message: 'User doesn\'t exists, you should create an account' });
                console.log('User doesn\'t exists, you should create an account');
            }
        });
    }
    checkWebmasterRole(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get user
            const { user } = req.body;
            // Check if info is given
            if (user === undefined || user.username === undefined) {
                res.status(400).json({ message: 'Missing user information' });
                console.log('Missing user information');
            }
            // Check if user is webmaster
            const isWebmaster = yield user_service_1.default.isWebmaster(user.username);
            // If error
            if (isWebmaster === null) {
                res.status(500).json({ message: 'Error checking user role' });
                console.log('Error checking user role');
            }
            else if (isWebmaster) {
                console.log('User has webmaster role');
                next();
            }
            else {
                res.status(401).json({ message: 'User doesn\'t have webmaster role' });
                console.log('User doesn\'t have webmaster role');
            }
        });
    }
    clearUserData(req, _res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get user
            req.body.user = {
                username: 'Anonymous'
            };
            next();
        });
    }
}
exports.default = new UserMiddlewares();
