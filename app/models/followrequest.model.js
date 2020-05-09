const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var FollowRequestSchema = new Schema({

    requesteeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"
    },

    accepteeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"
    }

}, { timestamps: true,  versionKey: false } )

FollowRequestSchema.index( { "requesteeId": 1, "acepteeId": 1 }, { unique: true } );

let FollowRequest = mongoose.model('followrequests', FollowRequestSchema );

module.exports = FollowRequest;