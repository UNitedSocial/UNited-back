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
const User_model_1 = __importDefault(require("../models/User.model"));
class USerService {
    userExists(username) {
        return __awaiter(this, void 0, void 0, function* () {
            // check if user exist
            const user = yield User_model_1.default.findOne({ username })
                .catch((err) => {
                console.log(err);
                return false;
            });
            if (user != null) {
                return true;
            }
            else {
                return false;
            }
        });
    }
    isWebmaster(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const userDoc = yield User_model_1.default.findOne({ username })
                .catch((error) => {
                // return null to handle error in the middleware
                console.log(error.message);
                return null;
            });
            // if user is not defined
            if (userDoc == null)
                return null;
            // if user is not webmaster (isMaster is optional)
            if (userDoc.isMaster === undefined || userDoc.isMaster === null || !userDoc.isMaster)
                return false;
            return true;
        });
    }
}
exports.default = new USerService();
