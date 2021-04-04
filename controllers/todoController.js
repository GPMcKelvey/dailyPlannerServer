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

//get all personal todos
router.get('/', validateJWT, async (req, res) => {
    try {
        await models.TodosModel.findAll({
            where: {
                userId: req.user.id
            }
        })
        .then(
            task => {
                res.status(200).json({
                    message: 'personal tasks retrieved',
                    task: task
                })
            }
        )
    } catch (err) {
        res.status(500).json({
            message: `Failed to retrieve tasks: ${err}`
        })
    }
});

//update task
router.put('/update/:id', validateJWT, async (req, res) => {
    const {task, complete} = req.body.todos;
    const taskId = req.params.id;

    const query = {
        where: {
            id: taskId,
            userId: req.user.id
        }
    };

    const updatedTask = {
        task: task,
        complete: complete
    };

    try {
        await models.TodosModel.update(updatedTask, query);
        res.status(200).json({ message: "Task Updated"});
        
        } catch (err) {
        res.status(500).json({ error: err });
    }
    
});

//delete task
router.delete("/delete/:id", validateJWT, async (req, res) => {
    const ownerId = req.user.id;
    const taskId = req.params.id;

    try {
        const query = {
            where: {
                id: taskId,
                userId: ownerId
            }
        };

        await models.TodosModel.destroy(query);
        res.status(200).json({ message: "Task DESTROYED!" });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

module.exports = router;