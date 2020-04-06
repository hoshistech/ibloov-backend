const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var items = new Schema({

    title: {
        type: String,
        required: true
    }, 

    quantity: {
        type: Number,
        default: 1
    },

    link: {
        type: String,
        required: true
    },

    imageUrl: {
        type: String
    },

    price: {
        type: Number,
        required: true
    },

    rating: {
        type: Number
    },

    desciption: {
        type: String
    },

    volunteer: {

        type: mongoose.Schema.Types.ObjectId,
        required: false,
        default: null,
        ref: "User"
    }

})

var WishListSchema = new Schema({

    name: {
        type: String,
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

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
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


WishListSchema.index( { "name": 1, "userId": 1 }, {unique: true} );


let Wishlist = mongoose.model('wishlists', WishListSchema);

module.exports = Wishlist;
