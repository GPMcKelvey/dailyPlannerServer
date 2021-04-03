const Express = require('express');
const router = Express.Router();
const { models } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UniqueConstraintError } = require('sequelize/lib/errors');

//
router.post('/signup', async (req, res) => {
    const {username, password, admin} = req.body.user;
    try {
        await models.UsersModel.create({
            username: username,
            password: bcrypt.hashSync(password, 10),
            admin: admin
        })
        .then(
            user => {
                let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24});
                res.status(201).json({
                    user: user,
                    message: 'user created',
                    sessionToken: `Bearer ${token}`
                });
            }
        )
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: 'Username already in use.'
            });
        } else {
            res.status(500).json({
                error: `Failed to register user: ${err}`
            });
        };
    };
});

router.post('/login', async(req, res) => {

    const {username, password} = req.body.user;

    try {
       await models.UsersModel.findOne({
           where: {
               username: username
           }
       })
       .then(
           user => {
            if (user) {
                bcrypt.compare(password, user.password, (err, matches) => {
                if(matches) {
                    let sessionToken = jwt.sign(
                        {id: user.id},
                        process.env.JWT_SECRET,
                        {expiresIn:60*60*24})
                    res.status(200).json({
                        user: user,
                        message: "Successfully logged in!",
                        sessionToken: `Bearer ${sessionToken}`
                    })
                } else {
                    res.status(401).json({
                        message: "Incorrect email or password"
                    })
                }
            })
        }
    }
)
    } catch (err) {
        //console.log(err);
        res.status(500).json({
            message:"Error logging in!"
        });
    };
});

// router.get('/userinfo', async (req, res) => {
//     try {
//         await models.UsersModel.findAll({
//             include: [
//                 {
//                     model: models.PostsModel,
//                     include: [
//                         {
//                             model: models.CommentsModel
//                         }
//                     ]
//                 }
//             ]
//         })
//         .then(
//             users => {
//                 res.status(200).json({
//                     users: users
//                 });
//             }
//         )
//     } catch (err) {
//         res.status(500).json({
//             error: `Failed to retrieve users: ${err}`
//         });
//     };
// });

module.exports = router;