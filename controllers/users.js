const userRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

userRouter.post("/register", async (req, res, next) => {
    const {username, name, password} = req.body;

    if(username === undefined || name === undefined || password === undefined){
        return res.status(401).json({message: "Missing username or password."});
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
        username,
        name,
        passwordHash
    });

    user.save()
        .then(user => res.json(user))
        .catch(err => next(err));

});

userRouter.post("/login", async (req, res, next) => {
    const {username, password} = req.body;

    if(username === undefined || password === undefined){
        return res.status(401).json({message: "Missing username or password."});
    }

    const user = await User.findOne({username: username});
    if(user){
        console.log('------')
        console.log(user);
        const samePassword = await bcrypt.compare(password, user.passwordHash);
        if(samePassword){
            const userToken = {
                username: user.username,
                id: user._id
            }
            
            const signedToken = await jwt.sign(userToken, process.env.SECRET);
            console.log(signedToken);

            return res.status(200).json({
                username: user.username,
                name: user.name,
                token: signedToken
            })
        }
        return res.status(401).json({message: "Username of password is incorrect."});
    }

    return res.status(401).json({message: "Username of password is incorrect."});

});

module.exports = userRouter;