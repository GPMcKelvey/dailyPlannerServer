const db = require('../db');

const UsersModel = require('./users');
const EventsModel = require('./events');
const NotesModel = require('./notes');
const TodosModel = require('./todos');

UsersModel.hasMany(EventsModel);
UsersModel.hasMany(NotesModel);
UsersModel.hasMany(TodosModel);

EventsModel.belongsTo(UsersModel);

NotesModel.belongsTo(UsersModel);

TodosModel.belongsTo(UsersModel);

module.exports = {
    dbConnection: db,
    models: {
        UsersModel,
        EventsModel,
        NotesModel,
        TodosModel,
    }
};