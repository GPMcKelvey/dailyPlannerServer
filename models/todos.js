const { DataTypes } = require("sequelize");
const db = require("../db");

const Todos = db.define("todos", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  task: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  complete: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  }
});

module.exports = Todos;