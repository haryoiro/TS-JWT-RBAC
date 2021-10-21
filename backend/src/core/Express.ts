
import * as express from "express"
import * as cors from "cors"
import * as path from "path"
import * as helmet from 'helmet';
import * as boom from "express-boom-v2"
import * as cookieParser from "cookie-parser"
// import * as csurf from "csurf"
import { useExpressServer, getMetadataArgsStorage, RoutingControllersOptions, Action } from "routing-controllers"
import { morganMiddleware } from '../middleware/morganMiddleware'
import { authorizationChecker } from "../common/AuthChecker";

const sourceRootPath = process.env.NODE_ENV === "production" ? "dist" : "src"
const controllersPath = path.resolve(sourceRootPath, "controllers")
const middlewaresPath = path.resolve(sourceRootPath, "middleware")
export const options: RoutingControllersOptions = {
  defaultErrorHandler: true,
  validation: true,
  cors: true,
  authorizationChecker,
  controllers: [`${controllersPath}/*.[tj]s`],
  middlewares: [`${middlewaresPath}/*.middleware.[tj]s`],
};

export class ExpressConfig {

  app: express.Express

  constructor() {
    this.app = express()
    this.app.use(helmet());
    this.app.use(cors())
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(cookieParser())
    this.app.use(boom())
    this.app.use(morganMiddleware)
    this.setUpControllers();

  }

  /**
   * @see https://github.com/typestack/routing-controllers
   */
  setUpControllers() {
    useExpressServer(this.app, options)
    return this.app
  }
}
