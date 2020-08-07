const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PromotionSchema = new Schema({

    brand: {
        type: String
    },

    promotionStart: {
        type: Date
    },

    startDate: {
        type: Date
    },

    endDate: {
        type: Date
    },

    fee: {
        type:Number
    },

    isDiscounted: {
        type: Number,
        default: false
    },

    discount: {

        type: Number,
        required: function(){
            return this.isDiscounted === true
        }
    }
}, {timestamps: true,  versionKey: false} );

/**
 * checks if a promotion model is discounted.
 */
PromotionSchema.methods.isDiscounted = function() {

    return ( this.isDiscounted === true )
};

let Promotions = mongoose.model('promotions', PromotionSchema);

module.exports = Promotions;