var validateCurrencyCode = require('validate-currency-code');
var cc = require('currency-codes'); 


module.exports = {

    validateCurrencyCode: ( currencyCode ) => {

        return ( validateCurrencyCode( currencyCode.toUpperCase() )) ? true : false;
    },


    getCurrencyCodeFromCountry: ( country ) => {

        return cc.country( country )[0].code;
    }
}