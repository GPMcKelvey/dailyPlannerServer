const Express = require('express');
const router = Express.Router();
const validateJWT = require('../middleware/validateSession');

const {models} = require('../models');

//test route
router.get('/test', (req, res) => {
    res.send('Test route events working')
});

//create route
router.post('/create', validateJWT, async (req, res) => {

    const {eventTitle, eventDescription, eventDate, eventStartTime, eventEndTime, eventPrivacy} = req.body.events;

    try {
        await models.EventsModel.create({
            eventTitle: eventTitle,
            eventDescription: eventDescription,
            eventDate: eventDate,
            eventStartTime: eventStartTime,
            eventEndTime: eventEndTime,
            eventPrivacy: eventPrivacy,
            userId: req.user.id
        })
        .then(
            event => {
                res.status(200).json({
                    message: 'event created',
                    event: event
                });
            }
        )
    } catch (err) {
        res.status(500).json({
            message: `Failed to create event ${err}`
        })
    }
});

module.exports = router;