const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var EventSchema = new Schema({

    name: {
        type: String,
        unique: true,
        required: true
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
        coordinates: [ Number ]
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
        type: String,
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

    createdAt: {
        type: Date,
        //required: true
    },

    updatedAt: {
        type: Date,
    },

    eventCode: [{
        name: String,
        description: String
    }], //should have a maximum of x possible generations

    sponsors: [{
        name: String,
        logo: String,
    }],

    coordinators: [{
        
        name: String,
        email: String,
        userId: String //optional. for people on the platform
    }],

    invitees: [{
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        userId: String, //optional. for people on the platform
        accepted: {
            type: String,
            enum: ["YES", "NO", "MAYBE", null],
            default: null,
        }
    }], 

    history: [{
        event: String,
        comment: String,
        userId: String,
        createdAt: Date
    }],

    controls: [{
        name: String,
        createdAt: Date,
        createdBy: String
    }],

    followers: [{
        email: String, //maybe
        telephone: String, //maybe
        userId: String,
        date: {
            type: Date,
            default: Date.now()
        },
        allowNoifications: {
            type: Boolean,
            default: true
        }
    }],

    likes: [{
        email: String,
        userId: String,
        date: {
            type: Date,
            default: Date.now()
        },
        allowNoifications: {
            type: Boolean,
            default: true
        }
    }],

    deletedAt: {
        type: Date,
        default: null
    }, 
    
    deletedBy: {
        type: String,
        default: null
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

});

// EventSchema.pre('save', function(next) {

//     console.log("trying to convert!");
//     console.log(this._id, typeof this._id)
//     console.log(this._id.toString(), typeof this._id.toString() )
//     this._id = this._id.toString();
//     next();
// });


EventSchema.index({ "location": "2dsphere" });

let Events = mongoose.model('events', EventSchema);

module.exports = Events;
