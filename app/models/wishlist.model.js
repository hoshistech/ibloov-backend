const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var invite = new Schema({

    name: {
        type: String
    },

    email: {
        type: String,
        required: true
    },

    userId: { //optional. for people on the platform
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }, 

    accepted: {
        type: String,
        enum: ["YES", "NO", "MAYBE", null],
        default: null,
    }
}, { _id : false } )


var pledge = new Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    quantity: {
        type: Number,
        default: 1
    },

    mode: { //this talks about how the donor intends to redeem this pledge
        type: String,
        enum: ["CASH", "GIFT", "GIFT_CARDS", "OTHERS"],
        default: "GIFT" 
    },

    customMode: { //this talks about how the donor intends to redeem this pledge
        type: String,
        required: function(){
            return this.mode == "OTHERS"
        }
    },

    createdAt: {
        type: Date,
        default: Date.now()
    }
}, { _id : false } )


var item = new Schema({

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

    currency: {
        type: String,
        required: true
    },

    rating: {
        type: Number
    },

    desciption: {
        type: String
    },

    pledges: {
        type: [ pledge ],
        default: []
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
        type: [ item ],
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

    invitees: {
        type: [ invite ],
        required: false,
        default: []
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: function(){

            return this.eventId !== null 
        }
    },

    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    history: [{
        event: String,
        comment: String,
        userId: { //optional. for people on the platform
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        createdAt: Date
    }],

    deletedAt: {
        type: Date,
        default: null
    }, 
    
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: "User"
    },

    allowcashRedemption: {

        type: String,
        enum: [true, false],
        default: false
    }

}, {timestamps: true,  versionKey: false} );


WishListSchema.index( { "name": 1, "userId": 1 }, {unique: true} );


let Wishlist = mongoose.model('wishlists', WishListSchema);

module.exports = Wishlist;
