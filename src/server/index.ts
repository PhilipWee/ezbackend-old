//TODO: Make this a non-relative import
import { EzModel, EzRouter, EzBackend } from "./../model";
import { Sequelize, DataTypes } from "sequelize";
import fastify, { FastifyInstance } from "fastify";
import fastifySwagger from "fastify-swagger";
import path from "path";
import open from "open";

const logger = console;

type startOptions = {};

//TODO: Add ts-node as dependency
//TODO: Figure out how to watch the .ezb folder and recompile on update
export function preHandler(options: startOptions) {
  const ezb = EzBackend.app()
  ezb.sequelize = new Sequelize("sqlite::memory");
  ezb.server = fastify({ logger: true });
  initSwagger(ezb.server);
}

export function handler(options: startOptions) {
  const customEzbPath = path.join(process.cwd(), "/.ezb/index.ts");
  require(customEzbPath);
}

function initSwagger(server: FastifyInstance) {
  server.register(fastifySwagger, {
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
}

export async function start(options: startOptions) {
  preHandler(options);
  handler(options);
  postHandler(options);
}

//TODO: Place all these functions inside a class
export async function postHandler(
  options: startOptions
) {
  const ezb = EzBackend.app()
  if (!ezb.sequelize || !ezb.server) {
     //TODO: Custom error?
     throw "Fastify instance does not exist on app! Have you run preHandler yet?"
  }
  ezb.sequelize.sync();
  
  const port = process.env.PORT ? Number(process.env.PORT) : 8888;
  await ezb.server.listen(port);
  //TODO: Reduce swagger logging output
  ezb.server.swagger();
  logger.log(`EzBackend Listening on ${port}`);
  open(`http://localhost:${port}/docs`)
}
