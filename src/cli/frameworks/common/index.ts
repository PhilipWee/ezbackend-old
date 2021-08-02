import { EzModel, EzRouter } from "ezbackend";
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

// export const customEndpoint = new EzRouter("custom")

// customEndpoint.registerRoute({
//   method: 'GET',
//   url: '/',
//   schema: {
//     body: {

//     },
//     response: {
//       200: {}
//     }
//   },
//   handler(req,res) {
//     res.send('hi')
//   }
// })