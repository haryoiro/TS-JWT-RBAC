"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.morganMiddleware = void 0;
const morgan = require("morgan");
const Logging_1 = require("../common/Logging");
const stream = {
    write: (message) => Logging_1.logger.http(message),
};
const skip = () => {
    const env = process.env.NODE_ENV || "development";
    return env !== "development";
};
const loggingFormat = ':method :url :status :res[content-length] - :response-time ms :body';
const registerRequestBodyToken = () => {
    morgan.token('body', (req) => JSON.stringify(req.body));
};
// const registerGraphQLToken = () => {
//   morgan.token("graphql-query", (req: Request) => `GraphQL ${req.body.query}`);
// };
registerRequestBodyToken();
exports.morganMiddleware = morgan(loggingFormat, { stream, skip });
//# sourceMappingURL=morganMiddleware.js.map