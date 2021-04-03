const { DataTypes } = require("sequelize");
const db = require("../db");

const Events = db.define("events", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  eventTitle: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  eventDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  eventDate: {
      type: DataTypes.DATE,
      allowNull: false,
  },
  eventStartTime: {
      type: DataTypes.TIME,
      allowNull: true,
  },
  eventEndTime: {
      type: DataTypes.TIME,
      allowNull: true,
  },
  eventPrivacy: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
  }
});

module.exports = Events;