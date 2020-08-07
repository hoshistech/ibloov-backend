const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var contact = new Schema({

    email: {
        type: String,
        required: function(){
            
            return (! this.telephone && ! this.userId);
        }
    },

    telephone: {
        type: String,
        required: function(){
            
            return (! this.email && ! this.userId);
        }
    },

    userId: { //optional. for people on the platform
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: function(){
            return (! this.email && ! this.telephone);
        }
    },

    contactId: {
        type: Number,
        ref: "contacts",
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