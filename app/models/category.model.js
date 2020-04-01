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

    createdAt: {
        type: Date,
        default: new Date
        //required: true
    },

    updatedAt: {
        type: Date,
        default: new Date
    },

    deletedAt: {
        type: Date,
        default: null
    }, 
    
    deletedBy: {
        type: String,
        default: null
    }

});


let Category = mongoose.model('categories', CategorySchema);

module.exports = Category;
