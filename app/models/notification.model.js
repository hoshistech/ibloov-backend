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
        }
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
        ref: "events"
    },

    crowdfundId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "crowdfunds"
    },

    recepient: {
        type: mongoose.Mixed,
        requried: true
    }


}, { timestamps: true,  versionKey: false } );



let Promotions = mongoose.model('notifications', NotificationSchema);

module.exports = Promotions;