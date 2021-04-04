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

//get all public events
router.get('/public', async (req, res) => {

    try {
        await models.EventsModel.findAll({
            where: {
                eventPrivacy: false
            }
        })
        .then(
            event => {
                res.status(200).json({
                    message: 'events retrieved',
                    event: event
                });
            }
        )
    } catch (err) {
        res.status(500).json({
            message: `Failed to retrieve events: ${err}`
        })
    }
});

//get all personal events
router.get('/personal', validateJWT, async (req, res) => {
    try {
        await models.EventsModel.findAll({
            where: {
                userId: req.user.id
            }
        })
        .then(
            event => {
                res.status(200).json({
                    message: 'personal events retrieved',
                    event: event
                })
            }
        )
    } catch (err) {
        res.status(500).json({
            message: `Failed to retrieve events: ${err}`
        })
    }
});

//update event
router.put('/update/:id', validateJWT, async (req, res) => {
    const {eventTitle, eventDescription, eventDate, eventStartTime, eventEndTime, eventPrivacy} = req.body.events;
    const eventId = req.params.id;

    const query = {
        where: {
            id: eventId,
            userId: req.user.id
        }
    };

    const updatedEvent = {
        eventTitle: eventTitle,
        eventDescription: eventDescription,
        eventDate: eventDate,
        eventStartTime: eventStartTime,
        eventEndTime: eventEndTime,
        eventPrivacy: eventPrivacy
    };

    try {
        await models.EventsModel.update(updatedEvent, query);
        res.status(200).json({ message: "Event Updated"});
        
        } catch (err) {
        res.status(500).json({ error: err });
    }
    
});

//delete event
router.delete("/delete/:id", validateJWT, async (req, res) => {
    const ownerId = req.user.id;
    const eventId = req.params.id;

    try {
        const query = {
            where: {
                id: eventId,
                userId: ownerId
            }
        };

        await models.EventsModel.destroy(query);
        res.status(200).json({ message: "Event DESTROYED!" });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

module.exports = router;