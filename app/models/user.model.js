const mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');

//JWT secret key
var secret = process.env.JWT_SECRET_KEY;

var Schema = mongoose.Schema;

var UserSchema = new Schema({

    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },

    fullName: {
        type: String
    },

    email: {
        type: String,
        unique: true
    },

    isEmailVerified: {
        type: Boolean,
        default: false
    },

    verificationCode: [{
        code: {
            type: String
        },
        expires: {
            type: Date
        }
    }],

    phoneNumber: {
        type: String,
        unique: true,
        required: false
    },

    isPhoneNumberVerified: {
        type: Boolean,
        default: false
    },

    dob: {
        type: Date
    },

    address: {

        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },

        postalCode: {
            type: String
        }
    }

}, {timestamps: true,  versionKey: false} );

UserSchema.methods.generateJWT = function() {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
    id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000),
    }, secret);
};

UserSchema.methods.toAuthJSON = function(){

    return {
    username: this.username,
    email: this.email,
    token: this.generateJWT(),
    bio: this.bio,
    image: this.image
};
};

UserSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

let Users = mongoose.model('users', UserSchema);
module.exports = Users;