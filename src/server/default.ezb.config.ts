import { ezbConfig } from "../model"
import { Sequelize } from "sequelize";
import {fastify} from 'fastify'
import fastifySwagger from "fastify-swagger";
import path from 'path'
import open from "open";

//TODO: Include this file in an additional templated option for the CLI tool
const config:ezbConfig = {
    preInit: [],
    init: (ezb,options,cb) => {
        ezb.sequelize = new Sequelize("sqlite::memory");
        ezb.server = fastify({ logger: {
            prettyPrint: true
        } });
        ezb.server.register(fastifySwagger, {
            routePrefix: "/docs",
            exposeRoute: true,
            swagger: {
              info: {
                title: "EzBackend API",
                description: "Automatically generated documentation for EzBackend",
                version: "1.0.0",
              },
              externalDocs: {
                url: "https://github.com/Collaboroo/ezbackend",
                description: "Find more info here",
              },
              schemes: ["http"],
              consumes: ["application/json"],
              produces: ["application/json"],
            },
          });
        cb();
    },
    postInit: [],
    preHandler: [],
    handler: (ezb, options, cb) => {
        const customEzbPath = path.join(process.cwd(), "/.ezb/index.ts");
        require(customEzbPath);
        cb();
    },
    postHandler: [],
    preRun: [],
    run: async (ezb, options, cb) => {
        if (!ezb.sequelize || !ezb.server) {
            //TODO: Custom error?
            throw "Fastify instance does not exist on app! Have you run preHandler yet?";
          }
        ezb.sequelize.sync();

        const port = process.env.PORT ? Number(process.env.PORT) : 8888;
        await ezb.server.listen(port);
        //TODO: Reduce swagger logging output
        ezb.server.swagger();
        open(`http://localhost:${port}/docs`);
        cb();
    },
    postRun: []
}

export default config