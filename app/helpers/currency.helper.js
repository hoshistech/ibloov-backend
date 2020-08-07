var validateCurrencyCode = require('validate-currency-code');
var cc = require('currency-codes'); 


module.exports = {

    validateCurrencyCode: ( currencyCode ) => {

        const codeToUpper = currencyCode.toUpperCase();
        return validateCurrencyCode( codeToUpper );
    },


    getCurrencyCodeFromCountry: ( country ) => {

        return cc.country( country )[0].code;
    }
}