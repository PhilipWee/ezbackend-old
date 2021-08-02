//TODO: Make this a non-relative import
import { EzModel, EzRouter } from "./../model";
import { Sequelize, DataTypes } from "sequelize";
import fastify, { FastifyInstance } from "fastify";
import fastifySwagger from "fastify-swagger";
import path from "path";
import open from "open";

const logger = console;

type startOptions = {};

export function preHandler(options: startOptions) {
  const server = fastify({ logger: true });
  initSwagger(server);
  const sequelize = new Sequelize("sqlite::memory");
  return { server, sequelize };
}

export function handler(options: startOptions) {
  const customEzbPath = path.join(process.cwd(), "/.ezb/index.ts");
  const customEzb = require(customEzbPath);
  //Parse the user's code
  const models = Object.values(customEzb).filter(
    (obj) => Object.getPrototypeOf(obj) === EzModel.prototype
  ) as Array<EzModel>;
  const routers = Object.values(customEzb).filter(
    (obj) => Object.getPrototypeOf(obj) === EzRouter.prototype
  ) as Array<EzRouter>;

  return { models: models, routers: routers };
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
  const { server, sequelize } = preHandler(options);
  const { models, routers } = handler(options);
  postHandler(server, sequelize, models, routers, options);
}

//TODO: Place all these functions inside a class
export async function postHandler(
  server: FastifyInstance,
  sequelize: Sequelize,
  models: Array<EzModel>,
  routers: Array<EzRouter>,
  options: startOptions
) {
  models.forEach((model) => {
    model.init(sequelize);
    server.register(model.registerFunction(), { prefix: model.routePrefix });
  });
  routers.forEach((router) => {
    server.register(router.registerFunction(), { prefix: router.routePrefix });
  });
  sequelize.sync();
  const port = process.env.PORT ? Number(process.env.PORT) : 8888;
  await server.listen(port);
  //TODO: Reduce swagger logging output
  server.swagger();
  logger.log(`EzBackend Listening on ${port}`);
  open(`http://localhost:${port}/docs`)
}
