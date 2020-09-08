const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var FeedbackSchema = new Schema({

    message: {
        type: String,
        required: true
    },

    section: {
        type: String
    },

    uuid: {
        type: String,
        unique: true,
        required: true
    },
    
    images: [{
        url: String
    }],

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"
    },

    deletedAt: {
        type: Date,
        default: null
    }, 
    
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        default: null
    }

}, { timestamps: true,  versionKey: false } );

let Feedback = mongoose.model('feedbacks', FeedbackSchema );

module.exports = Feedback;