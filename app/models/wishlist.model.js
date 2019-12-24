const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var WishListSchema = new Schema({

    name: {
        type: String,
        unique: true,
        required: true
    },

    items: [{

        name: String, 
        quantity: Number,
        externalLink: String //if you saw the item on a different store for sale, you can add it here. 
        //users can then click oand go straight to the that page

    }],

    uuid: {
        type: String,
        unique: true,
        required: true
    },

    // isPrivate: {
    //     type: Boolean,
    //     default: false,
    //     enum: [true, false]
    // },

    createdAt: {
        type: Date,
        required: true
    },

    createdBy: {
        type: String,
        required: true
    },

    updatedBy: {
        type: String
    },

    updatedAt: {
        type: Date,
    },

    // status: {
    //     type: String,
    //     default: "ONGOING",
    //     allowedValues: ["CANCELLED", "LIVE", "UPCOMING", "SUSPENDED"],
    //     required: true
    // },



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
        type: String
    }

});


let Events = mongoose.model('wishlists', WishListSchema);

module.exports = Events;
