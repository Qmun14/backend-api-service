import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Customers = db.define('customers', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    gender: DataTypes.STRING
}, {
    freezeTableName: true
});

export default Customers;

// (async () => {
//     await db.sync()
// })();