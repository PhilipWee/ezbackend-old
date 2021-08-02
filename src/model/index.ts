import { ModelAttributes, Model, ModelCtor } from "sequelize";

import { RouteOptions } from "fastify";
import { getModelSchema } from "./sequelize-json-schema";
import {
  badRequest,
  singleID,
  notFound,
  notFoundMsg,
} from "./generic-response";
import { Sequelize } from "sequelize";
import _ from "lodash";

const logger = console;

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
    this.routes.push(newRoute);
  }

  //TODO: Figure out how to add types to this
  public registerFunction() {
    let that = this;
    return function (server: any, opts: any, done: any) {
      that.routes.forEach((route) => {
        server.route(route);
      });
      done();
    };
  }
}

export class EzModel extends EzRouter {
  model: ModelCtor<Model<any, any>> | undefined;
  modelName: string;
  attributes: ModelAttributes<Model<any, any>>;

  //TODO: Validation to ensure modelName will not mess up the route prefix
  //Perhaps can use the inflection pluralisation library
  constructor(modelName: string, attributes: ModelAttributes<Model<any, any>>) {
    super(`/${modelName}`); //Note: No trailing slash is intentional
    this.modelName = modelName;
    this.attributes = attributes;
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
    const apis = this.getAllAPIs();
    apis.forEach((api) => {
      this.registerRoute(api);
    });
  }

  getAllAPIs() {
    return [this.createOneAPI(), this.getOneAPI(), this.updateOneAPI(),this.deleteOneAPI()];
  }

  createOneAPI() {
    let that = this;
    const routeDetails: RouteOptions = {
      method: "POST",
      url: "/",
      schema: {
        body: this.getJsonSchema(false),
        response: {
          200: this.getJsonSchema(true),
          400: badRequest,
        },
      },
      async handler(req, res) {
        if (that.model === undefined) {
          //TODO: Custom error?
          throw "Model has not been set yet";
        }
        const newObj = await that.model.create(req.body);
        res.send(newObj);
      },
    };
    return routeDetails;
  }

  getOneAPI() {
    let that = this;
    const routeDetails: RouteOptions = {
      method: "GET",
      url: "/:id",
      schema: {
        params: singleID,
        response: {
          200: this.getJsonSchema(true),
          404: notFound,
        },
      },
      //TODO: Figure out a way to represent types
      async handler(req, res) {
        if (that.model === undefined) {
          //TODO: Custom error?
          throw "Model has not been set yet";
        }
        //@ts-ignore
        const savedObj = await that.model.findByPk(req.params.id);
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
  updateOneAPI() {
    let that = this;
    const routeDetails: RouteOptions = {
      method: "PUT",
      url: "/:id",
      schema: {
        params: singleID,
        body: this.getJsonSchema(false),
        response: {
          200: this.getJsonSchema(true),
          404: notFound,
        },
      },
      //TODO: Figure out a way to represent types
      async handler(req, res) {
        if (that.model === undefined) {
          //TODO: Custom error?
          throw "Model has not been set yet";
        }
        //@ts-ignore
        const savedObj = await that.model.findByPk(req.params.id);
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
  deleteOneAPI() {
    let that = this;
    const routeDetails: RouteOptions = {
      method: "DELETE",
      url: "/:id",
      schema: {
        params: singleID,
        body: this.getJsonSchema(false),
        response: {
          200: this.getJsonSchema(true),
          404: notFound,
        },
      },
      //TODO: Figure out a way to represent types
      async handler(req, res) {
        if (that.model === undefined) {
          //TODO: Custom error?
          throw "Model has not been set yet";
        }
        //@ts-ignore
        const savedObj = await that.model.findByPk(req.params.id);
        if (savedObj === null) {
          res.code(404).send(notFoundMsg);
          return;
        }
        await savedObj.destroy()
        res.send(savedObj);
      },
    };
    return routeDetails;
  }
}
