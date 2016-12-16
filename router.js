const Authentication = require('./controllers/authentication')
const passportService = require('./services/passport')
const passport = require('passport')

const requireAuth = passport.authenticate('jwt', {session: false})
const localAuth = passport.authenticate('local', {session: false})

module.exports = function(app) {

    app.get('/',requireAuth,  function(req, res, next){

        res.send(['water bottle', 'phone', 'wallet'])
    });

    app.post('/signup', Authentication.signup);
    app.post('/signIn',localAuth,  Authentication.signIn);
}