import { IncomingMessage } from "http";
import * as morgan from "morgan";

import { logger } from "../common/Logging";

const stream: morgan.StreamOptions = {
  write: (message) => logger.http(message),
};

const skip = () => {
  const env = process.env.NODE_ENV || "development";
  return env !== "development";
};


const loggingFormat = ':method :url :status :res[content-length] - :response-time ms :body'

interface Request extends IncomingMessage { body: any }

const registerRequestBodyToken = () => {
  morgan.token('body', (req: Request) => JSON.stringify(req.body))
}
// const registerGraphQLToken = () => {
//   morgan.token("graphql-query", (req: Request) => `GraphQL ${req.body.query}`);
// };

registerRequestBodyToken()

export const morganMiddleware = morgan(
  loggingFormat, { stream, skip }
);
