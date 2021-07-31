import { ModelAttributes, Sequelize, Model } from "sequelize";

export default class EzModel {

    modelName: string
    attributes: ModelAttributes<Model<any,any>>

    constructor(modelName: string, attributes: ModelAttributes<Model<any,any>>) {
        this.modelName = modelName
        this.attributes = attributes
    }

}

export function test() {
    console.log('hello')
}