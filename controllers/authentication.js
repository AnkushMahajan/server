const mongoose = require('mongoose');
const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function tokenForUser(user){
    const TimeStamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: TimeStamp }, config.secret);
}

exports.signup = function(req, res, next){

    const email = req.body.email;
    const password = req.body.password;

    if(!email || !password){
        return res.status(422).send({error: 'Please provide the complete signing in details'})
    }

    User.findOne({email: email}, function(err, existingUser){
        if(err){ return next(error)};

        if(existingUser){
            return res.status(422).send({error: 'Email is in use'});
        }

        const user = new User({
            email: email,
            password: password
        });

        user.save((err) => {
            if(err){ return next(err)};

            res.json({ token: tokenForUser(user) });
        });
    })

}

exports.signIn = function(req, res, next){

    res.send({token:tokenForUser(req.user)});
}