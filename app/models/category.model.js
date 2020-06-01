const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CategorySchema = new Schema({

    name: {
        type: String,
        required: true
    },

    meta: {
        icon: String,
        backgroundColor: String,
        textColour: String
    },

    scope: {
        type: String,
        required: true
    },

    uuid: {
        type: String,
        unique: true,
        required: true
    },

    deletedAt: {
        type: Date,
        default: null
    }, 
    
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: "users"
    }

}, {timestamps: true, versionKey: false} );


let Category = mongoose.model('categories', CategorySchema);

module.exports = Category;
