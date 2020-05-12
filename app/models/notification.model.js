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
        enum: ['follow-request', 'extra-invite-request']
    },

    requestId: {

        type: mongoose.Schema.Types.ObjectId,
        required: function(){
            return this.type == 'request';
        }
    },

    recepient: {
        type: mongoose.Mixed,
        requried: true
    }


}, { timestamps: true,  versionKey: false} );



let Promotions = mongoose.model('notifications', NotificationSchema);

module.exports = Promotions;