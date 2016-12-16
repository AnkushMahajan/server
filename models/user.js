const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

// define our model
const UserSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    password: String
});

// on save hook , encrypt password
// Before saving a model run this function
UserSchema.pre('save', function (next) {

    // get access to user model
    const user = this;

    // generate a salt then run callback
    bcrypt.genSalt(10, function(err, salt){

        if(err){ return next(err) };

        // hash (encrypt) our password using the salt
        bcrypt.hash(user.password, salt, null, function (err, hash) {

            if(err){ return next(err) };
            // overwrite password with hash
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function (candidatePwd, callBack) {

    bcrypt.compare(candidatePwd, this.password, function(err, isMatch){
        if(err) { return callBack(err);}

        callBack(null, isMatch);
    })
}

// create model class
const ModelClass = mongoose.model('user', UserSchema);


module.exports = ModelClass;