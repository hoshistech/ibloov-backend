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
})

let Payments = mongoose.model('payments', PaymentSchema );

module.exports = Payments;