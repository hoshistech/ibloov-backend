const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CategorySchema = new Schema({

    name: {
        type: String,
        required: true
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
        ref: "User"
    }

}, {timestamps: true, versionKey: false} );


let Category = mongoose.model('categories', CategorySchema);

module.exports = Category;
