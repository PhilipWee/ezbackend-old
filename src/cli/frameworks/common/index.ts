import { EzModel } from "ezbackend";
import { DataTypes } from "sequelize";

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
