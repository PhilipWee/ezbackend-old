import fastify from "fastify";
import fastifySwagger from "fastify-swagger";

const server = fastify({ logger: true });

server.register(fastifySwagger, {
  routePrefix: "/docs",
  exposeRoute: true,
  swagger: {
    info: {
      title: "EzBackend API",
      description:
        "Automatically generated documentation for EzBackend",
      version: "1.0.0",
    },
    externalDocs: {
      url: "https://github.com/Collaboroo/ezbackend",
      description: "Find more info here",
    },
    host: "localhost",
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
  },
});

type startOptions = {};

server.get("/", async (request, reply) => {
  return { hello: "world" };
});

export async function start(options: startOptions) {
  const port = process.env.PORT ? Number(process.env.PORT) : 8888;
  await server.listen(port);
  server.swagger();
}
