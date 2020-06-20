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

    updatedAt: {
        type: Date,
        default: Date.now
    }

}, { timestamps: true, _id : false })

var transaction = new Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },

    pledge: {
        type: Number,
        required: true
    },

    transactionId: {
        type: String,
        unique: true
    },

    date: {
        type: Date,
        default: Date.now()
    }
})


var crowdfundInvite = new Schema({

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

    description: {
        type: String
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

    inviteLink: {

        type: String,
        required: false,
        unique: function(){
            this.inviteLink ? true : false
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

    transactions: {
        type: [ transaction ],
        default: []
    },

    invitees: {
        type: [ crowdfundInvite ],
        required: false,
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
        required: true
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

}, { timestamps: true,  versionKey: false, toJSON: { virtuals: true } } );

CrowdFundingSchema.index( { "name": 1, "userId": 1 }, {unique: true} );

CrowdFundingSchema.virtual('totalDonated').get(function () {

    donations = this.donors;
    return donations.reduce(( total, donation) => donation.pledge + total, 0);

});


let CrowdfundingSchema = mongoose.model('crowdfunds', CrowdFundingSchema);

module.exports = CrowdfundingSchema;
