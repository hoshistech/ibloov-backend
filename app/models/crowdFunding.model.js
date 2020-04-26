const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var donor = new Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
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

var crowdfundImage = new Schema({

    url: {
        type: String,
        required: true,
        max: 255
    }
}, { _id : false } )

var CrowdFundingSchema = new Schema({

    name: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true
    }, 

    category: {
        type: String
    },

    totalDonations: {
        type: Number
    },

    currency: {
        type: String,
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

    startDate: {
        type: Date,
        default: function(){
            return (! this.startDate) ? Date.now() : this.startDate
        }
    },

    endDate: {
        type: Date,
        required: true
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
        ref: "users",
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
            ref: "users"
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
    },

    images: {
        type: [ crowdfundImage ],
        default: []
    },

}, { timestamps: true,  versionKey: false} );

CrowdFundingSchema.index( { "name": 1, "userId": 1 }, {unique: true} );

CrowdFundingSchema.virtual('totalDonated').get(function () {

    donations = this.donors;
    return donations.reduce(( total, donation) => donation.pledge + total, 0)
});

let CrowdfundingSchema = mongoose.model('crowdfunds', CrowdFundingSchema);

module.exports = CrowdfundingSchema;
