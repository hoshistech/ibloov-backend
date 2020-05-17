const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var NotificationSchema = new Schema({

    sender: {
        type: mongoose.Mixed,
        ref: "users",
        required: true
    },

    message: {
        type: String,
        required: true
    },

    type: {
        type: String,
        required: true,
        enum: ['request', 'info']
    },

    requestcategory: {
        type: String,
        required: function(){
            return this.type == 'request';
        },
        enum: ['follow-request', 'extra-invite-request', 'event-invite-request']
    },

    requestId: {

        type: mongoose.Schema.Types.ObjectId,
        ref: "requests",
        required: function(){
            return this.type == 'request';
        }
    },

    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        required: function(){
            return this.requestcategory == "extra-invite-request" || this.requestcategory == "event-invite-request"
        },
        ref: "events"
    },

    recepient: {
        type: mongoose.Mixed,
        requried: true
    }


}, { timestamps: true,  versionKey: false } );



let Promotions = mongoose.model('notifications', NotificationSchema);

module.exports = Promotions;