const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var items = new Schema({

    name: {
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
    } //if you saw the item on a different store for sale, you can add it here. 
    //users can then click oand go straight to the that page
})

var WishListSchema = new Schema({

    name: {
        type: String,
        unique: true,
        required: true
    },

    items: {
        type: [ items ],
        required: true
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
