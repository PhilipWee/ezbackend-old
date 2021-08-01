//@ts-ignore
import EzModel from "ezbackend";
import pkg, { Sequelize } from "sequelize";
//TODO: Properly set up the compiler so we don't have disgusting shit like this
const { DataTypes } = pkg;

export const user = new EzModel("users", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
