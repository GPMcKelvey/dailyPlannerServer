const Express = require('express');
const router = Express.Router();
const validateJWT = require('../middleware/validateSession');

const {models} = require('../models');

//test route
router.get('/test', (req, res) => {
    res.send('Test route notes working')
});

//create route
router.post('/create', validateJWT, async (req, res) => {

    const {title, content} = req.body.notes;

    try {
        await models.NotesModel.create({
            title: title,
            content: content,
            userId: req.user.id
        })
        .then(
            note => {
                res.status(200).json({
                    message: 'note created',
                    note: note
                });
            }
        )
    } catch (err) {
        res.status(500).json({
            message: `Failed to create note ${err}`
        })
    }
});

//get all personal notes
router.get('/', validateJWT, async (req, res) => {
    try {
        await models.NotesModel.findAll({
            where: {
                userId: req.user.id
            }
        })
        .then(
            task => {
                res.status(200).json({
                    message: 'personal notes retrieved',
                    task: task
                })
            }
        )
    } catch (err) {
        res.status(500).json({
            message: `Failed to retrieve notes: ${err}`
        })
    }
});

//update note
router.put('/update/:id', validateJWT, async (req, res) => {
    const {title, content} = req.body.notes;
    const noteId = req.params.id;

    const query = {
        where: {
            id: noteId,
            userId: req.user.id
        }
    };

    const updatedNote = {
        title: title,
        content: content
    };

    try {
        await models.NotesModel.update(updatedNote, query);
        res.status(200).json({ message: "Note Updated"});
        
        } catch (err) {
        res.status(500).json({ error: err });
    }
    
});

//delete note
router.delete("/delete/:id", validateJWT, async (req, res) => {
    const ownerId = req.user.id;
    const noteId = req.params.id;

    try {
        const query = {
            where: {
                id: noteId,
                userId: ownerId
            }
        };

        await models.NotesModel.destroy(query);
        res.status(200).json({ message: "Note DESTROYED!" });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

module.exports = router;