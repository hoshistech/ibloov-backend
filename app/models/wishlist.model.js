const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var items = new Schema({

    item: {
        type: String,
        required: true
    }, 
    quantity: {
        type: Number,
        default: 1
    },
    itemLink: {
        type: String,
        required: true
    },
    itemImage: {
        type: String
    } //if you saw the item on a different store for sale, you can add it here. 
    //users can then click oand go straight to the that page
})

var WishListSchema = new Schema({

    name: {
        type: String,
        unique: true,
        required: true,
        max: 255
    },

    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        default: null,
        ref: "Event"
    },

    items: {
        type: [ items ],
        required: false
    },

    uuid: {
        type: String,
        unique: true,
        required: true
    }, 
    
    isPrivate: {
        type: Boolean,
        default: false,
        enum: [true, false] 
    },

    invitees: [{
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true
        },

        userId: { //optional. for people on the platform
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        accepted: {
            type: String,
            enum: ["YES", "NO", "MAYBE", null ],
            default: null,
        }
    }],

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
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        createdAt: {
            type: Date,
            default: new Date
        }
    }],

    deletedAt: {
        type: Date,
        default: null
    }, 
    
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: "User"
    }

}, {timestamps: true} );


let Events = mongoose.model('wishlists', WishListSchema);

module.exports = Events;
