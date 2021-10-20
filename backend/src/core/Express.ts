
import * as express from "express"
import * as cors from "cors"
import * as path from "path"
import * as helmet from 'helmet';
import * as boom from "express-boom-v2"
import * as cookieParser from "cookie-parser"
import * as csurf from "csurf"
import * as swaggerUiExpress from 'swagger-ui-express'
import { useExpressServer, getMetadataArgsStorage, RoutingControllersOptions } from "routing-controllers"
import { routingControllersToSpec } from 'routing-controllers-openapi'
import { morganMiddleware } from '../middleware/morganMiddleware'
import { CorsOptions } from "cors";



const sourceRootPath = process.env.NODE_ENV === "production" ? "dist" : "src"
const controllersPath = path.resolve(sourceRootPath, "controllers")
const options: RoutingControllersOptions = {
  defaultErrorHandler: false,
  validation: true,
  controllers: [`${controllersPath}/*.[tj]s`],
  cors: true
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
    this.setUpSwagger()
    this.setUpControllers();
  }

  /**
   *  @see https://github.com/epiphone/routing-controllers-openapi
   *
   *  @description デコレータからAPIの内容を解析し、自動的にSwaggerDocを作成
   */
  async setUpSwagger() {

    const storage = await getMetadataArgsStorage()
    const spec = await routingControllersToSpec(storage, options, {
      components: {
        securitySchemes: {
          jwt: {
            scheme: 'Bearer',
            type: 'http',
            bearerFormat: 'JWT',
          },
        },
        schemas: {
          user: {
            type: "object",
            properties: {
              email: {
                type: "string",
              },
              username: {
                type: "string"
              },
              id: {
                type: "number",
              },
              role: {
                type: "number"
              }
            }
          },
          token: {
            type: "object",
            properties: {
              accessToken: {
                type: "string"
              },
              refreshToken: {
                type: "string",
              },
              expiresIn: {
                type: "number"
              }
            }
          }
        }
      },
      security: [{ jwt: [] }],
      info: {
        title: 'SimpleBBS',
        version: '1.0.0',
      },
    })

    this.app.use("/doc",
      await swaggerUiExpress.serve,
      await swaggerUiExpress.setup(spec)
    )

  }

  /**
   * @see https://github.com/typestack/routing-controllers
   */
  setUpControllers() {
    useExpressServer(this.app, options)
    return this.app
  }
}
