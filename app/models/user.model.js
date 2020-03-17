const mongoose = require('mongoose');

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
        type: String
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
        type: String
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

});

let Events = mongoose.model('users', UserSchema);
module.exports = Events;