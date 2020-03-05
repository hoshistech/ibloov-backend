const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({

    userId: {
        type: String,
        required: true
    },

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

    isVerified: {
        type: Boolean,
        default: false
    },

    phoneNumber: {
        type: String
    },

    folowers: [
        {
            userId: String,
            email: String,
            fullName: String,
            dateFollowed: Date
        }
    ]

});

let Events = mongoose.model('users', UserSchema);
module.exports = Events;