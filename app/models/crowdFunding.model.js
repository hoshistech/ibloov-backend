const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var donor = new Schema({

    name: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    email: {
        type: String,
        required: true
    },
    pledge: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

var CrowdFundingSchema = new Schema({

    name: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true
    }, 

    isPrivate: {
        type: Boolean,
        enum: [true, false], 
        default: false
    }, 

    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        default: null
    },

    dueDate: { // for crowdfundings tied to an event, consider setting the expiry date to x day(s) before the event
        type: Date,
        //required: true
    },

    donors: {
        type: [ donor ],
        default: []
    },

    uuid: {
        type: String,
        unique: true,
        required: true
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
    },

    history: [{
        event: String,
        comment: String,
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        createdAt: String
    }],

    deletedAt: {
        type: Date,
        default: null
    }, 
    
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    }

}, { timestamps: true,  versionKey: false} );

CrowdFundingSchema.index( { "name": 1, "userId": 1 }, {unique: true} );


let CrowdfundingSchema = mongoose.model('crowdfunds', CrowdFundingSchema);


module.exports = CrowdfundingSchema;
