const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var EventSchema = new Schema({

    name: {
        type: String,
        unique: true,
        required: true
    },

    category: {
        type: String
    },

    uuid: {
        type: String,
        unique: true,
        required: true
    },

    eventDate: {
        type: Date,
        required: true
    },

    isPrivate: {
        type: Boolean,
        default: false,
        enum: [true, false]
    },

    createdBy: {
        type: String,
        required: true
    },

    updatedBy: {
        type: String
    },

    status: {
        type: String,
        default: "UPCOMING",
        allowedValues: ["CANCELLED", "LIVE", "UPCOMING", "SUSPENDED"],
        required: true
    },

    createdAt: {
        type: Date,
        required: true
    },

    updatedAt: {
        type: Date,
    },

    eventCode: [{
        name: String,
        description: String
    }], //should have a maximum of x possible generations

    hashTags: {
        type: Array,
        default : []
    },

    sponsors: [{
        name: String,
        logo: String,
    }],

    coordinators: [{
        
        name: String,
        email: String,
        id: String //optional. for people on the platform
    }],

    invitees: [{

        name: String,
        email: String,
        id: String //optional. for people on the platform
    }], 

    history: [{
        event: String,
        comment: String,
        userId: String,
        createdAt: String
    }]

    //sponsors, event date, type

});

let Events = mongoose.model('events', EventSchema);

module.exports = Events;
