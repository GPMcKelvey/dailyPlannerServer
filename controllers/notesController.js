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

module.exports = router;