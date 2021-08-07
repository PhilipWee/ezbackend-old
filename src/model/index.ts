import { ModelAttributes, Model, ModelCtor } from "sequelize";

import { RouteOptions, FastifyInstance } from "fastify";
import { getModelSchema } from "./sequelize-json-schema";
import {
  badRequest,
  singleID,
  notFound,
  notFoundMsg,
} from "./generic-response";
import { Sequelize } from "sequelize";
import _ from "lodash"; //TODO: For all lodash make sure to import only what is needed

const logger = console;

//TODO: Make sequelize and server never null, just overwritable
export class EzBackend {
  sequelize: Sequelize | null;
  server: FastifyInstance | null;

  private static instance: EzBackend;

  private constructor() {
    this.sequelize = null;
    this.server = null;
  }

  public static app(): EzBackend {
    if (!EzBackend.instance) {
      EzBackend.instance = new EzBackend();
    }

    return EzBackend.instance;
  }
}

export class EzRouter {
  routePrefix: string;
  routes: Array<RouteOptions>;

  //TODO: Validation to ensure routeprefix is legitimate
  constructor(routePrefix: string) {
    this.routePrefix = routePrefix;
    this.routes = [];
  }

  //TODO: Figure out why on earth the types are no registering on the frontend for this
  public registerRoute(newRoute: RouteOptions) {
    const server = EzBackend.app().server;
    console.log("registering route");
    if (server) {
      server.register(this.registerFunction(newRoute), {
        prefix: this.routePrefix,
      });
    } else {
      //TODO: Custom error?
      throw "Fastify instance does not exist on app! Have you run preHandler yet?";
    }
  }

  //TODO: Figure out how to add types to this
  public registerFunction(newRoute: RouteOptions) {
    return function (server: any, opts: any, done: any) {
      server.route(newRoute);
      done();
    };
  }
}

export class EzModel extends EzRouter {
  model: ModelCtor<Model<any, any>> | undefined;
  modelName: string;
  attributes: ModelAttributes<Model<any, any>>;
  apiFactories: {
    [key:string] : (model:EzModel) => RouteOptions
  }

  //TODO: Validation to ensure modelName will not mess up the route prefix
  //Perhaps can use the inflection pluralisation library
  constructor(modelName: string, attributes: ModelAttributes<Model<any, any>>) {
    super(`/${modelName}`); //Note: No trailing slash is intentional
    this.modelName = modelName;
    this.attributes = attributes;
    const sequelize = EzBackend.app().sequelize;
    this.apiFactories = {
      'createOne': EzModel.createOneAPI,
      'getOne':EzModel.getOneAPI,
      'updateOne':EzModel.updateOneAPI,
      'deleteOne':EzModel.deleteOneAPI,
    }
    if (sequelize) {
      this.init(sequelize);
    } else {
      //TODO: Custom error?
      throw "Fastify instance does not exist on app! Have you run preHandler yet?";
    }
  }

  setModel(sequelize: Sequelize) {
    this.model = sequelize.define(this.modelName, this.attributes);
  }

  //TODO: Change to use schemas as defined in https://www.fastify.io/docs/latest/Validation-and-Serialization/
  getJsonSchema(full: boolean) {
    if (this.model === undefined) {
      //TODO: Custom error?
      throw "Model has not been set yet";
    }

    if (full) {
      return getModelSchema(this.model);
    } else {
      return getModelSchema(this.model, {
        exclude: ["id", "createdAt", "updatedAt"],
      });
    }
  }

  init(sequelize: Sequelize) {
    this.setModel(sequelize);
    Object.entries(this.apiFactories).forEach(([key,apiFactory]) => {
      this.registerRoute(apiFactory(this));
    });
  }


  public static createOneAPI(ezModel:EzModel) {
    const routeDetails: RouteOptions = {
      method: "POST",
      url: "/",
      schema: {
        body: ezModel.getJsonSchema(false),
        response: {
          200: ezModel.getJsonSchema(true),
          400: badRequest,
        },
      },
      async handler(req, res) {
        if (ezModel.model === undefined) {
          //TODO: Custom error?
          throw "Model has not been set yet";
        }
        const newObj = await ezModel.model.create(req.body);
        res.send(newObj);
      },
    };
    return routeDetails;
  }

  public static getOneAPI(ezModel:EzModel) {
    const routeDetails: RouteOptions = {
      method: "GET",
      url: "/:id",
      schema: {
        params: singleID,
        response: {
          200: ezModel.getJsonSchema(true),
          404: notFound,
        },
      },
      //TODO: Figure out a way to represent types
      async handler(req, res) {
        if (ezModel.model === undefined) {
          //TODO: Custom error?
          throw "Model has not been set yet";
        }
        //@ts-ignore
        const savedObj = await ezModel.model.findByPk(req.params.id);
        if (savedObj === null) {
          res.code(404).send(notFoundMsg);
          return;
        }
        res.send(savedObj);
      },
    };
    return routeDetails;
  }

  //TODO: Can we make the above and below merge so that we are DRY?
  public static updateOneAPI(ezModel: EzModel) {
    const routeDetails: RouteOptions = {
      method: "PUT",
      url: "/:id",
      schema: {
        params: singleID,
        body: ezModel.getJsonSchema(false),
        response: {
          200: ezModel.getJsonSchema(true),
          404: notFound,
        },
      },
      //TODO: Figure out a way to represent types
      async handler(req, res) {
        if (ezModel.model === undefined) {
          //TODO: Custom error?
          throw "Model has not been set yet";
        }
        //@ts-ignore
        const savedObj = await ezModel.model.findByPk(req.params.id);
        if (savedObj === null) {
          res.code(404).send(notFoundMsg);
          return;
        }
        const updatedObj = _.extend(savedObj, req.body);
        await updatedObj.save();
        res.send(updatedObj);
      },
    };
    return routeDetails;
  }

  //TODO: Can we make the above and below merge so that we are DRY?
  public static deleteOneAPI(ezModel: EzModel) {
    const routeDetails: RouteOptions = {
      method: "DELETE",
      url: "/:id",
      schema: {
        params: singleID,
        body: ezModel.getJsonSchema(false),
        response: {
          200: ezModel.getJsonSchema(true),
          404: notFound,
        },
      },
      //TODO: Figure out a way to represent types
      async handler(req, res) {
        if (ezModel.model === undefined) {
          //TODO: Custom error?
          throw "Model has not been set yet";
        }
        //@ts-ignore
        const savedObj = await ezModel.model.findByPk(req.params.id);
        if (savedObj === null) {
          res.code(404).send(notFoundMsg);
          return;
        }
        await savedObj.destroy();
        res.send(savedObj);
      },
    };
    return routeDetails;
  }
}
