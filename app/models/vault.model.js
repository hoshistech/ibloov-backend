const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var VaultSchema = new Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"
    },

    customerId: {
        type: String,
        required: true
    },

    token: {
        type: String
    }
}, { timestamps: true,  versionKey: false } )

VaultSchema.index( { "userId": 1, "customerId": 1, "token": 1}, {unique: true} );


let Vault = mongoose.model('vaults', VaultSchema );

module.exports = Vault;