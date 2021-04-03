const Express = require('express');
const router = Express.Router();
const validateJWT = require('../middleware/validateSession');

const {models} = require('../models');


// router.get('/test', (req, res) => {
//     res.send('Test route todo working')
// })

router.post('/create', validateJWT, async (req, res) => {

    const {task} = req.body.todos;

    try{
        await models.TodosModel.create({
            task: task,
            userId: req.user.id
        })
        .then(
            task => {
                res.status(201).json({
                    task: task,
                    message: 'task created'
                });
            }
        )
    } catch (err) {
        res.status(500).json({
            error: `Failed to create post: ${err}`
        });
    };
});

module.exports = router;