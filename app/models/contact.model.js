const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userContact = new Schema({

    telepone: {
        type: Number,
        required: true
    },

    email: {
        type: String
    },

    createdAt: {
        type: Date,
        default: Date.now()
    }
}, { _id: false})

var contactSchema = new Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },

    contacts: {
        type: [ userContact ],
        default: []
    }
}, { timestamps: true,  versionKey: false } )


let Contact = mongoose.model('contacts', contactSchema );

module.exports = Contact;