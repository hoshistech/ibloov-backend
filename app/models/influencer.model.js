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

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
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
        required: [true, "missing username value"],
        lowercase: true,
        unique: true,
        index: true
    },

    userId: {

        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
        index: true
    },

    isVerified: {
        type: Boolean,
        enum: [true, false],
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

}, {timestamps: true,  versionKey: false} );


/**
 * gets a Influencer's followers
 * @returns array
 */
InfluencerSchema.methods.getFollowers = function() {
    return this.followers;
};

/**
 * checks if an influencer has followers
 * @returns bool
 */
InfluencerSchema.methods.hasFollowers = function() {

    return this.getFollowers().length > 0;
};


// InfluencerSchema.pre('save', function(next) {

//     console.log("gets here to pre-save")
//     console.log(this.verifiedDate);

//     delete this.verifiedDate;
//     delete this.isVerified;
//     next();
// });

/**
 * gets a list of an influencer's events
 * 
 * @returns bool
 */
InfluencerSchema.methods.getEvents = function() {

    return this.events;
};

let Influencers = mongoose.model('influencers', InfluencerSchema);
module.exports = Influencers;