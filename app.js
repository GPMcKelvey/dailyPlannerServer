require('dotenv').config();
//imports
const Express = require('express');
const dbConnection = require('./db');
const controllers = require('./controllers');
const middleware = require('./middleware');

//instantiation
const app = Express();

//middleware
app.use(middleware.CORS);
app.use(Express.json());

//endpoints
app.use('/users', controllers.userController);
app.use('/events', controllers.eventController);
app.use('/todos', controllers.todoController);
app.use('/notes', controllers.notesController);

// app.listen(3000, () => {
//     console.log(`[Server]: App is listening on ${process.env.PORT}`)
// });

//db auth & sync
try{
    dbConnection.authenticate()
        .then(async () => await dbConnection.sync())
        .then(() => {
            app.listen(process.env.PORT, () => {
                console.log(`[server]: App is listening on ${process.env.PORT}.`);
            });
        });
} catch (err) {
        console.log(`[server]: Server crashed. Error = ${err}`);
    };