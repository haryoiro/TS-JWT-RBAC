import { User } from "../entity/User";
import { Connection, createConnection } from "typeorm";
import { getMetadataArgsStorage} from "routing-controllers"
import { routingControllersToSpec } from 'routing-controllers-openapi'
import * as swaggerUiExpress from 'swagger-ui-express'
import { options } from "./Express";
import express = require("express");

export class DocumentConfig {

    app: express.Express

    constructor(app) {
        this.app = app
        this.setUpSwagger()
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
}