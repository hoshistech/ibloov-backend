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
        ref: "User",
        required: function(){
            return (! this.email && ! this.telephone);
        }
    },

    allowNoifications: {
        type: Boolean,
        enum: [true, false],
        default: true
    }

}, { _id : false } )

var follower = new Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },

    date: {
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
        ref: "User",
        required: function(){
            return (! this.email && ! this.telephone);
        }
    }, 

    accepted: {
        type: String,
        enum: ["YES", "NO", "MAYBE", null],
        default: null,
    }
}, { _id : false } )

var like = new Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },

    date: {
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
        type: String
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

    endDate: {
        type: Date,
        required: true
    },

    isPrivate: {
        type: Boolean,
        default: false,
        enum: [true, false] 
    },

    updatedBy: {
        type: String
    },

    status: {
        type: String,
        default: "UPCOMING",
        enum: [ "CANCELLED", "LIVE", "UPCOMING", "SUSPENDED" ],
        required: true
    },

    eventCode: [{
        type: String,
        description: String
    }], //should have a maximum of x possible generations

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
            ref: "User"
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
        ref: "User"
    },

    wishlistId: {
        type: mongoose.Schema.Types.ObjectId, //maybe this should be an objectId type
        ref: "Wishlist",
        default: null
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId, //maybe this should be an objectId type
        ref: "User",
        required: true
    },
    
    crowdfundingId: {
        type: mongoose.Schema.Types.ObjectId, //maybe this should be an objectId type
        ref: "Crowdfund",
        default: null
    },

    isRecurring: {
        type: Boolean,
        default: false
    },

    frequency: {
        type: String,
        enum: ["DAILY", "MONTHLY", "WEEKLY", "YEARLY"],
        default: null
    }, 

    publish: { //determines if the event should be shown or not 
        type: Boolean,
        default: false
    },

    allowNoifications: {
        type: Boolean,
        enum: [true, false],
        default: true
    }


}, {timestamps: true,  versionKey: false} );


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
