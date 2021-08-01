import { EzModel, EzRouter } from "./../model/index.js";
import pkg, { Sequelize } from "sequelize";
const { DataTypes } = pkg;
import fastify, { FastifyInstance } from "fastify";
import fastifySwagger from "fastify-swagger";

const logger = console;

type startOptions = {};

export function preHandler(options: startOptions) {
  const server = fastify({ logger: true });
  initSwagger(server);
  const sequelize = new Sequelize("sqlite::memory");
  return { server, sequelize };
}

export function handler(options: startOptions) {
  //Imaginary end user code
  const user = new EzModel("Users", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  user.registerRoute({
    method: "GET",
    url: `/:id`,
    schema: {},
    handler(request: any, reply: any) {
      reply.send(request.query.field);
    },
  });
  const ping = new EzRouter("ping");
  ping.registerRoute({
    method: "GET",
    url: "/",
    handler(req, res) {
      res.send("pong");
    },
  });
  //Imaginary end user code
  return { models: [user], routers: [ping] };
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
}

// export async function test() {
//   const server = fastify();

//   ezmodel.init(sequelize);
//   server.register(ezmodel.registerFunction(), { prefix: ezmodel.routePrefix });
//   sequelize.sync();
//   const port = 8000;
//   await server.listen(port);
//   server.swagger();
// }
