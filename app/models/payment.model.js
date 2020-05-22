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


    currency: {
        type: String
    },

    exchangeRate: {
        type: mFloat
    },

    paymentRef: {
        type: String,
        enum: ["creditcard", "appleplay", "paypal"]
    },

    channel: {
        type: String
    },

    platform: {
        type: String,
        enum: ["web", "mobile"]
    },

    reponse: {
        type: String
    }
})

let Payments = mongoose.model('payments', PaymentSchema );

module.exports = Payments;