import EzModel from "ezbackend";
import {DataTypes, Sequelize } from "sequelize";

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
