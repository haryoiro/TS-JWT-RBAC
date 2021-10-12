import { errorHandleMiddleware } from './../middleware/ErrorHandleMiddleware';
import * as express from "express"
import * as cors from "cors"
import * as path from "path"
import * as helmet from 'helmet';
import * as boom from "express-boom-v2"
import { useExpressServer } from "routing-controllers"
import { morganMiddleware } from '../middleware/morganMiddleware'

export class ExpressConfig {

  app: express.Express
  constructor() {
    this.app = express()
    this.app.use(cors())
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(helmet());
    this.app.use(boom())
    this.app.use(morganMiddleware)
    // this.app.use(errorHandleMiddleware)
    this.setUpControllers();
  }

  setUpControllers() {
    const sourceRootPath = process.env.NODE_ENV === "production" ? "dist" : "src"
    const controllersPath = path.resolve(sourceRootPath, "controllers")
    useExpressServer(this.app, {
      controllers: [`${controllersPath}/*.[tj]s`],
      cors: true
    })
    return this.app
  }
}