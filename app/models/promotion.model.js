const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PromotionSchema = new Schema({

    brand: {
        type: String
    },

    createdAt: {
        type: Date
    },

    updatedAt: {
        type: Date
    },

    promotionStart: {
        type: Date
    },

    startDate: {
        type: Date
    },

    endDate: {
        type: Date
    }
});

let Promotions = mongoose.model('promotions', PromotionSchema);

module.exports = Promotions;