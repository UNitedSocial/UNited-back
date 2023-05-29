"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
const app = new app_1.App().app;
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
exports.default = app;
