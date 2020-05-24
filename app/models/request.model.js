const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var RequestSchema = new Schema({

    requesteeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"
    },

    accepteeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"
    },

    accepted: {
        type: Boolean,
        default: null,
        enum: [ true, false, null ]
    },

    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "events"
    },

    type: {
        type: String,
        required: true
    }

}, { timestamps: true,  versionKey: false } )

// sRequestSchema.index( { "requesteeId": 1, "accepteeId": 1, "type": 1 }, { unique: true } );

let Request = mongoose.model('requests', RequestSchema );

module.exports = Request;