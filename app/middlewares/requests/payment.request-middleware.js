const { body } = require('express-validator');
const { validateCurrencyCode } = require("@helpers/currency.helper");

exports.validate = (method) => {

  switch (method) {

    /**
     * validates payment checkout request
     * amount exist|Number
     * nonceFromTheClient exists
     */
    case 'paymentCheckout': {

     return [ 

        body('amount')
        .exists().withMessage("expected body param 'amount' not provided"),

        body('nonceFromTheClient') 
        .exists().withMessage("expected body param 'nonceFromTheClient' value not provided."),

        body('currency')
        .exists().withMessage("expected body param 'currency' value not provided.")
        .custom( value => {

          if( ! validateCurrencyCode( value ) ) return Promise.reject("Invalid currency code provided.");

          return true;
        })

       ]   
    }
  }
}