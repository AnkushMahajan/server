const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// set up options for JWT Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
}

const localOptions = {
    usernameField: 'email'
}


// create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {

    // see if the user id in payload exists in db
    // if it does call done with that other
    // otherwise call done without user
    User.findById(payload.sub, function(err, user){
        if(err){ return done(err, false)};

        if(user){
            done(null, user);
        }else{
            done(null, false);
        }
    })

});

// create Local Strategy
const localLogin = new LocalStrategy(localOptions, function(email, pwd, done){

    // verify this username and pwd and call done with user other call done with false
    User.findOne({email: email}, function(err, user){
        if(err){ return done(err)};

        if(!user){
            return done(null, false);
        }

        user.comparePassword(pwd, function(err, isMatch){
            if(err){ return done(err)};

            if(!isMatch){ return done(null, false)}

            return done(null, user);
        })

    });

})

// Tell Passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
