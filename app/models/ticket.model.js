const mongoose = require('mongoose');
var Float = require('mongoose-float').loadType(mongoose, 2);

var Schema = mongoose.Schema;

var ticket = new Schema({

    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },

    ticketNumber: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now()
    },

    amount: {
        type: Float,
        required: true
    },

    isDiscount: {
        type: Boolean,
        default: function(){
            this.discountAmount > 0 ? true : false;
        }
    },

    discountAmount: {
        type: Float,
        default: 0,
        required: function(){
            this.isDiscount === true;
        }
    }

}, { _id : false } )



var TicketSchema = new Schema({

    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        default: null,
        ref: "events",
        unique: true
    },

    tickets: {  
        type: [ ticket ],
        required: false,
        default: []
    },

    currentCount: {
        type: String,
        default: "0"
    },

    history: [{
        event: String,
        comment: String,
        userId: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        },
        createdAt: Date
    }]

}, { timestamps: true,  versionKey: false });


TicketSchema.index( { "eventId": 1, "ticketNumber": 1 }, {unique: true} );


let Ticket = mongoose.model('tickets', TicketSchema);

module.exports = Ticket;
