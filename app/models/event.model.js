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

var coordinator = new Schema({

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
    }
}, { _id : false } )

var follower = new Schema({

    email: String, //maybe
    telephone: String, //maybe
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
}, { _id : false } )

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

var like = new Schema({

    email: String,
    
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

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    updatedBy: {
        type: String
    },

    status: {
        type: String,
        default: "UPCOMING",
        allowedValues: ["CANCELLED", "LIVE", "UPCOMING", "SUSPENDED"],
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
        type: String,
        createdAt: Date,
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
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

    wishList: {
        type: String, //maybe this should be an objectId type
        default: null
    },

    isRecurring: {
        type: Boolean,
        default: false
    },

    frequency: {
        type: String //for recurring events - monthly, daily, weekly, yearly, fornightly etc.
    }, 

    publish: { //determines if the event should be shown or not 
        type: Boolean,
        default: false
    }

}, {timestamps: true,  versionKey: false} );

// EventSchema.pre('save', function(next) {

//     console.log("trying to convert!");
//     console.log(this._id, typeof this._id)
//     console.log(this._id.toString(), typeof this._id.toString() )
//     this._id = this._id.toString();
//     next();
// });


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
