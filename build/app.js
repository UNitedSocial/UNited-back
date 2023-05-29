"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const aplication_router_1 = require("./routes/aplication.router");
class App {
    constructor() {
        this._app = (0, express_1.default)();
        this.initMiddlewares();
        this.startConnection(); // Call DB
    }
    // Initial middlewares
    initMiddlewares() {
        this._app.use((0, cors_1.default)());
        this._app.use(express_1.default.json());
        this._app.use(express_1.default.urlencoded({ extended: true }));
        this._app.use(aplication_router_1.applicationRouter); // Call router
    }
    get app() {
        return this._app;
    }
    // Connection to DB
    startConnection() {
        mongoose_1.default.connect(process.env.CONECTIONSTRING, {})
            .then(() => {
            console.log('Connected to MongoDB');
        })
            .catch((err) => {
            console.log('Error connecting to MongoDB', err.message);
        });
    }
}
exports.App = App;
