import * as express from "express"
import * as cors from "cors"
import * as path from "path"
import * as helmet from 'helmet';
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
    this.app.use(morganMiddleware)
    this.setUpControllers();
  }

  setUpControllers() {
    if (process.env.NODE_ENV === "production") {
      const controllersPath = path.resolve("dist", "controllers")
      useExpressServer(this.app, {
        controllers: [`${controllersPath}/*.js`],
        cors: true
      })
    }
    if (process.env.NODE_ENV === "development") {
      const controllersPath = path.resolve("src", "controllers")
      useExpressServer(this.app, {
        controllers: [`${controllersPath}/*.ts`],
        cors: true
      })
    }
  }
}