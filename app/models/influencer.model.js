const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var influencerEvent = new Schema({

    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },
    eventName: String
}, { _id : false })


var influencerWishlist = new Schema({

    wishlistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Wishlist",
        required: true
    },
    wishlistName: String
}, { _id : false } )

var influencerFollower = new Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    email: {
        type: String
    },
    fullName: {
        type: String
    },
    createdAt: {
        type: Date,
        default: new Date
    }
}, { _id: false })

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
        type: [influencerFollower],
        default: []
    },

    wishlists:{
        type: [influencerWishlist],
        required: false,
        default: []
        
    },  

    events: {
        type: [influencerEvent],
        required: false,
        default: []
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