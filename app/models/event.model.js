const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var sponsor = new Schema({

    name: {
        type: String,
        required: true,
        max: 255
    },
    logo: {
        type: String
    }
}, { _id : false } )

var image = new Schema({

    url: {
        type: String,
        required: true,
        max: 255
    }
}, { _id : false } )

var coordinator = new Schema({

    email: {
        type: String,
        required: function(){
            
            return (! this.telephone && ! this.userId);
        }
    },

    telephone: {
        type: String,
        required: function(){
            
            return (! this.email && ! this.userId);
        }
    },

    userId: { //optional. for people on the platform
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: function(){
            return (! this.email && ! this.telephone);
        }
    },

    allowNoifications: {
        type: Boolean,
        enum: [true, false],
        default: true
    },


    createdAt: {
        type: Date,
        default: Date.now()
    },

    accepted: { 

        type: String,
        default: null,
        enum: ["YES", "NO", null]
    }

}, { _id : false } )

var follower = new Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"
    },

    createdAt: {
        type: Date,
        default: Date.now()
    },

    allowNoifications: {
        type: Boolean,
        enum: [true, false],
        default: true
    }

}, { _id : false } )

var invite = new Schema({

    name: {
        type: String
    },

    email: {
        type: String,
        required: function(){
            
            return (! this.telephone && ! this.userId );
        }
    },

    telephone: {
        type: String,
        required: function(){
            
            return (! this.email && ! this.userId);
        }
    },

    userId: { //optional. for people on the platform
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: function(){
            return (! this.email && ! this.telephone);
        }
    }, 

    accepted: {
        type: String,
        enum: ["YES", "NO", null],
        default: null
    },

    createdAt: {
        type: Date,
        default: Date.now()
    }

}, { _id : false } )

var like = new Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"
    },

    createdAt: {
        type: Date,
        default: Date.now()
    },

    allowNoifications: {
        type: Boolean,
        default: true
    }

}, { _id: false } )

var EventSchema = new Schema({

    name: {
        type: String,
        unique: true,
        required: true,
        max: 255
    },

    category: {
        type: String,
        lowercase: true
    },

    images: {
        type: [ image ],
        default: []
    },

    isPaid: {
        type: Boolean,
        default: false
    },
     
    amount: {
        type: Number,
        required: function(){
            return this.isPaid === true;
        },
        default: null
    },

    currency: {
        type: String,
        required: function(){
            return this.isPaid === true;
        },
        default: null
    },

    description: {
        type: String,
        default: null
    },

    location: {

        address: {
            type: String,
            required: true
        },

        city: {
            type: String
        },

        country: {
            type: String
        }, 

        countryCode: {
            type: String
        },

        type: { 
            type: String,
            default: "Point"
        },

        coordinates: {
            type: [ Number ],
            default: [0, 0]
        }
    },

    uuid: {
        type: String,
        unique: true,
        required: true
    },

    startDate: {
        type: Date,
        required: true
    },

    isPrivate: {
        type: Boolean,
        default: false,
        enum: [true, false] 
    },

    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },

    status: {
        type: String,
        default: "UPCOMING",
        enum: [ "CANCELLED", "LIVE", "UPCOMING", "SUSPENDED" ],
        required: true
    },

    inviteLink: {

        type: String,
        required: false,
        unique: function(){
            this.inviteLink ? true : false
        }
    },

    eventCode: [{
        type: String,
        description: String
    }],

    sponsors: {
        type:[sponsor],
        required: false,
        default: []
    },

    coordinators: {
        type: [coordinator],
        required: false,
        default: []
    },

    invitees: {
        type: [invite],
        required: false,
        default: []
    }, 

    history: [{
        event: String,
        comment: String,
        userId: { //optional. for people on the platform
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        },
        createdAt: Date
    }],

    controls: [{
        type: String
    }],

    followers: {
        type: [ follower ],
        required: false,
        default: []
    },

    likes: {
        type: [ like ],
        required: false,
        default: []
    },

    deletedAt: {
        type: Date,
        default: null
    }, 
    
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: "users"
    },

    wishlistId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "wishlists",
        default: null
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    
    crowdfundingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "crowdfunds",
        default: null
    },

    isRecurring: {
        type: Boolean,
        default: false
    },

    frequency: {
        type: String,
        enum: ["DAILY", "MONTHLY", "WEEKLY", "YEARLY", null],
        required: function(){
            this.isRecurring == true
        },
        default: null
    }, 

    publish: { //determines if the event should be shown or not 
        type: Boolean,
        default: false
    },

    allowedPaymentChannels: {
        type: Array,
        required: false,
        // required: function(){
        //     this.isPaid === true
        // },
        default: []
    },

    qrCode: {
        type: String
    }

}, {timestamps: true,  versionKey: false, toJSON: { virtuals: true } } );


/**
 * notifiable users are those that are following this event
 * or have liked this event 
 * and havent turned off notification for the event
 */
EventSchema.methods.getNotifiableUsers = function() {

    //return this.events;
};

EventSchema.index({ "location": "2dsphere" });

let Events = mongoose.model('events', EventSchema);

module.exports = Events;
