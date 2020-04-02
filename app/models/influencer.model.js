const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var influencerEvent = new Schema({

    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },
    eventName: String
})

var influencerFollower = new Schema({

    userId: mongoose.Schema.Types.ObjectId,
    email: String,
    fullName: String,
    createdAt: {
        type: Date,
        default: new Date
    }
})

var InfluencerSchema = new Schema({

    category: {
        type: String,
        required: true
    },

    fee: {
        type: Number,
        default: null
    },

    username: {
        type: String,
        required: true,
        unique: true
    },

    userId: {

        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    verifiedDate: {
        type: Date,
        default: null,
        required: function(){

            return this.isVerified === true
        }
    },

    followers: {
        type: [influencerFollower]
    },

    events: {
        type: [influencerEvent],
        required: false
    },

    deletedAt: {
        type: Date,
        default: null
    }, 
    
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },

}, {timestamps: true} );

let Influencers = mongoose.model('influencers', InfluencerSchema);
module.exports = Influencers;