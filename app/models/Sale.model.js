const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var sale = new Schema({

    amount: {
        type: Number,
        required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"
    },

    paymentMethod: {

        type: String,
        enum: ["CASH", " CARD", "BITCOIN"]
    },

    createdAt: {
        type: Date,
        default: Date.now()
    },

    ticketNumber: {
        type: String,
        required: true
    },

    isDiscounted: {
        type: Boolean,
        default: false,
        enum: [true, false]
    },

    discount: {
        type: Number,
        default: null,
        required: function(){
            return this.isDiscounted === true
        }
    },

    platform: {
        type: String,
        enum: ["web", "mobile"],
        required: true
    }
})

var SaleSchema = new Schema({

    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "events"
    },

    sales: {
        type: [sale],
        default: []
    }
})

let Sales = mongoose.model('sales', SaleSchema );

module.exports = Sales;