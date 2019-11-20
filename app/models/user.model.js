const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({

    firstname: {
        type: String,
        required: true
    },

    lastname: {
        type: String,
        required: true
    },

    fullName: {
        type: String
    },

    email: {
        type: String
    },

    phonenumber: {
        type: String
    },

    dob: {
        type: String
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