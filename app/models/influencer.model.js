const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var InfluencerSchema = new Schema({

    category: {
        type: String,
        required: true
    },

    fee: {
        type: Number,
        default: null
    },

    user: {

        id: {
            type: String,
            required: true
        },
        fullName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        }
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    verifiedDate: {
        type: Date,
        default: null
    },

    followers: [
        {
            userId: String,
            email: String,
            fullName: String,
            createdAt: Date
        }
    ],

    events: [
        {
            eventId: String,
            eventName: String
        }
    ]

});

let Influencers = mongoose.model('influencers', InfluencerSchema);
module.exports = Influencers;