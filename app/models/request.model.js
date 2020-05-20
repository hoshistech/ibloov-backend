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
        enum: [true, false, null]
    },

    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        required: function(){
            return this.type == "extra-invite-request" || this.type == "event-invite-request" 
        },
        ref: "events"
    },

    type: {
        type: String,
        enum: ['follow-request', 'extra-invite-request', 'event-invite-request', 'event-coordinator-request'],
        required: true
    }

}, { timestamps: true,  versionKey: false } )

//RequestSchema.index( { "requesteeId": 1, "accepteeId": 1, "type": 1 }, { unique: true } );

let Request = mongoose.model('requests', RequestSchema );

module.exports = Request;