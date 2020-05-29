const mongoose = require('mongoose');
var mFloat = require('mongoose-float').loadType(mongoose, 2);

var Schema = mongoose.Schema;

var PaymentSchema = new Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"
    },

    amount: {
        type: mFloat,
        required: true
    },


    resourceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    resource: {
        type: String,
        required: true
    },


    currency: {
        type: String,
        required: true
    },

    paymentRef: {
        type: String
    },

    channel: {
        type: String
    },

    platform: {
        type: String,
        enum: ["web", "mobile"]
    },

    response: {
        type: mongoose.Mixed 
    }

}, { timestamps: true,  versionKey: false } )

let Payments = mongoose.model('payments', PaymentSchema );

module.exports = Payments;