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
const defaultOptions_config_1 = require("../config/defaultOptions.config");
class TestController {
    // Test route
    doomie(req, res, _next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get params or use default values for groups display
            const index = (req.query.n !== undefined) ? Number(req.query.n) : defaultOptions_config_1.displayOptions.index.n;
            const offset = (req.query.o !== undefined) ? Number(req.query.o) : defaultOptions_config_1.displayOptions.index.offset;
            // Try connection in a route
            console.log('Test completed sucessfully');
            res.status(200).json({ index, offset, message: 'Test completed successfully' });
        });
    }
}
exports.default = new TestController();
