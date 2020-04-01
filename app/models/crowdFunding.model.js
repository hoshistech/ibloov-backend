const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var donor = new Schema({

    name: String,
    userId: String,
    email: String,
    pledge: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

var CrowdFundingSchema = new Schema({

    name: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true
    }, 

    isPrivate: {
        type: Boolean,
        enum: [true, false], 
        default: false
    }, 

    eventId: {
        type: String,
        required: false,
        default: null
    },

    dueDate: { // for crowdfundings tied to an event, consider setting the expiry date to x day(s) before the event
        type: Date,
        required: true
    },

    donors: {
        type: [donor]
    },

    uuid: {
        type: String,
        unique: true,
        required: true
    },       

    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    },

    updatedAt: {
        type: Date,
    },

    createdBy: {
        type: String,
        required: true
    },

    updatedBy: {
        type: String
    },

    history: [{
        event: String,
        comment: String,
        userId: String,
        createdAt: String
    }],

    deletedAt: {
        type: Date,
        default: null
    }, 
    
    deletedBy: {
        type: String,
        default: null
    }

});


let Events = mongoose.model('crowdfunds', CrowdFundingSchema);

module.exports = Events;
