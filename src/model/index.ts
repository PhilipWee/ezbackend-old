import { ModelAttributes, Model } from "sequelize";

//Testing stuff
import { Sequelize } from "sequelize";
import fastify, { RouteOptions, FastifyPlugin, FastifyRegisterOptions } from "fastify";
import fastifySwagger from "fastify-swagger";

const logger = console

export class EzRouter {
  routePrefix: string
  routes:Array<RouteOptions>

  //TODO: Validation to ensure routeprefix is legitimate
  constructor(routePrefix: string) {
    this.routePrefix = routePrefix
    this.routes = []
  }

  public registerRoute(newRoute:RouteOptions) {
    this.routes.push(newRoute)
  }
  
  //TODO: Figure out how to add types to this
  public registerFunction() {
    let that = this
    return (function (server:any, opts:any, done:any) {
      that.routes.forEach((route) => {
        server.route(route)
      })
      done()
    })
  }
}

export class EzModel extends EzRouter{
  modelName: string;
  attributes: ModelAttributes<Model<any, any>>;

  //TODO: Validation to ensure modelName will not mess up the route prefix
  constructor(modelName: string, attributes: ModelAttributes<Model<any, any>>) {
    super(`/${modelName}`) //Note: No trailing slash is intentional
    this.modelName = modelName;
    this.attributes = attributes;
    this.registerRoute(this.createOneAPI())
  }

  createOneAPI() {
    const routeDetails:RouteOptions = {
      method: "POST",
      url: '/',
      schema: {
        body:{
          type: 'object',
          properties: {
            key1: {type: 'string'},
            key2: {type: 'number'}
          }
        },
        response: {
          200: {
            type: 'object',
            properties: {
              hello: {type: 'string'}
            }
          }
        }
      },
      handler(req,res) {
        
      }
    }
    return routeDetails
  }

}

export async function test() {
  const server = fastify();
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
      host: "localhost",
      schemes: ["http"],
      consumes: ["application/json"],
      produces: ["application/json"],
    },
  });
  
  
  const ezmodel = new EzModel("Users", {});
  ezmodel.registerRoute({
    method: "GET",
    url: `/:id`,
    schema: {},
    handler(request: any, reply: any) {
      reply.send(request.query.field);
    },
  })
  server.register(ezmodel.registerFunction(), {prefix: ezmodel.routePrefix})
  const port = 8000
  await server.listen(port);
  server.swagger();
  logger.log(`EzBackend Listening on ${port}`)
}
