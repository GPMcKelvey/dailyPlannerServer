const Express = require('express');
const router = Express.Router();
const { models } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UniqueConstraintError } = require('sequelize/lib/errors');
const validateJWT = require('../middleware/validateSession');

//sign up
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
                    message: 'User created!',
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

//login
router.post('/login', async(req, res) => {
    const {username, password} = req.body.user;
    try{
       let loginUser = await models.UsersModel.findOne({
           where:{
               username: username
           }
       });
       if(loginUser) {
           let passwordComparison = await bcrypt.compare(password,loginUser.password);
           if(passwordComparison){
               let token = jwt.sign(
                   {
                       id: loginUser.id
                   },
                   process.env.JWT_SECRET,
                   {
                       expiresIn:60*60*24
                   }
               );
               res.status(200).json({
                   user: loginUser,
                   message: "User successfully logged in!",
                   sessionToken: `Bearer ${token}`
               });
           } else {
               res.status(401).json({
                   message: "Incorrect username or password"
               });
           }
       } else {
           res.status(401).json({
               message:"Incorrect username or password"
           })
       }
    } catch(err) {
        console.log(err);
        res.status(500).json({
            message:"Error logging in!"
        });
    }
    });

// admin view all users
router.get('/userinfo', validateJWT, async (req, res) => {
    try {
        if (req.user.admin === true){
        await models.UsersModel.findAll({
            where: {
                admin: false
            }
        })
        .then(
            users => {
                res.status(200).json({
                    users: users
                });
            }
        )} else {
            res.status(403).json({
                message: 'not an admin'
            })
        }
    } catch (err) {
        res.status(500).json({
            error: `Failed to retrieve users: ${err}`
        });
    };
});

//admin delete
router.delete('/delete/:id', validateJWT, async (req, res) => {
    const userId = req.params.id;

    try {
        if (req.user.admin === true){
        await models.UsersModel.destroy({
            where: {
                id: userId
            },
            // include: {all: true}
        //     include: [
        //         {model: models.EventsModel},
        // ]
        })
        .then(
            user => {
                res.status(200).json({
                    message: 'user DESTROYED!',
                    user: user
                });
            }
        )} else {
            res.status(403).json({
                message: 'not an admin'
            })
        }
    } catch (err) {
        res.status(500).json({
            error: `Failed to retrieve users: ${err}`
        });
    };
});

module.exports = router;