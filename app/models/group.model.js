const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var contact = new Schema({

    telephone: {
        type: String,
        required: true
    },

    contactId: {
        type: Number,
        ref: "contacts",
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },

    email: {
        type: String
    },

    createdAt: {
        type: Date,
        default: Date.now()
    }
}, { _id : false } )

var GroupSchema = new Schema({

    name: {
        type: String,
        required: true
    },

    uuid: {
        type: String,
        unique: true,
        required: true
    }, 

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"
    },

    contacts: {
        type: [ contact ],
        default: []
    },

    deletedAt: {
        type: Date,
        default: null
    }, 
    
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        default: null
    },

    history: {
        type: Array,
        default: []
    }

}, { timestamps: true,  versionKey: false } )

GroupSchema.index( { "userId": 1, "name": 1 }, { unique: true } );

let Group = mongoose.model('groups', GroupSchema );

module.exports = Group;