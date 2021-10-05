"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
const config = require("config");
const Logging_1 = require("../common/Logging");
const Express_1 = require("./Express");
class Application {
    constructor() {
        this.express = new Express_1.ExpressConfig();
        const port = config.get("express.port");
        this.server = this.express.app.listen(port, () => {
            Logging_1.logger.info(`Server ready at http://localhost:${port}`);
        });
        this.app;
    }
    /**
     * jestでのテスト時に使用する
     * @returns Express
     */
    app() {
        return this.express.app;
    }
}
exports.Application = Application;
//# sourceMappingURL=Application.js.map