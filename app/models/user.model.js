const mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');

//JWT secret key
var secret = process.env.JWT_SECRET_KEY;

var Schema = mongoose.Schema;

var UserSchema = new Schema({

    authMethod: {
        type: String,
        required: true,
        enum: ['local', 'facebook', 'google', 'twitter']
    },

    local: {


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

    },

    facebook: {

    },

    google: {

        id: {
            type: String,
            required: true
        },
        email: String,
        firstName: String, 
        lastName: String

    },

    phoneNumber: {
        type: String,
        unique: true
    },

    isPhoneNumberVerified: {
        type: Boolean,
        enum: [true, false ],
        default: false
    },

    dob: {
        type: Date
    },


}, {timestamps: true,  versionKey: false} );

// UserSchema.methods.generateJWT = function() {
//     var today = new Date();
//     var exp = new Date(today);
//     exp.setDate(today.getDate() + 60);

//     return jwt.sign({
//     id: this._id,
//     username: this.username,
//     exp: parseInt(exp.getTime() / 1000),
//     }, secret);
// };

// UserSchema.methods.toAuthJSON = function(){

//     return {
//     username: this.username,
//     email: this.email,
//     token: this.generateJWT(),
//     bio: this.bio,
//     image: this.image
// };
// };

UserSchema.pre('save',  async (next) => {

    if( this.authMethod !== "local") next();

    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
})

// UserSchema.methods.validPassword = function(password) {
//     var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
//     return this.hash === hash;
// };

let Users = mongoose.model('users', UserSchema);

module.exports = Users;