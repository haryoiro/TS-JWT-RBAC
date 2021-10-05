"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressConfig = void 0;
const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const routing_controllers_1 = require("routing-controllers");
const morganMiddleware_1 = require("../middleware/morganMiddleware");
class ExpressConfig {
    constructor() {
        this.app = express();
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(helmet());
        this.app.use(morganMiddleware_1.morganMiddleware);
        this.setUpControllers();
    }
    setUpControllers() {
        const controllersPath = path.resolve("dist", "controllers");
        (0, routing_controllers_1.useExpressServer)(this.app, {
            controllers: [`${controllersPath}/*.js`],
            cors: true
        });
    }
}
exports.ExpressConfig = ExpressConfig;
//# sourceMappingURL=Express.js.map