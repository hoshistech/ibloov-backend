const { body } = require('express-validator');
const { validateCurrencyCode } = require("@helpers/currency.helper");

const { allowedPaymentResources, isValidResource } = require("@config/payableresources.config");

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
        }),

        body('resource')
        .exists().withMessage("expected body param 'resource' value not provided.")
        .custom( async ( value, { req, loc, path } ) => {

          if( ! allowedPaymentResources.includes( value ) ) return Promise.reject(`${ value } is currently not a valid payment resource.`);

          const resourceId = req.body.resourceId;

          if(! resourceId ){

            return Promise.reject("Required body param 'resourceId' value not provided..");
          }

          const isValid = await isValidResource( value, resourceId );
          if( ! isValid )  return Promise.reject(`${ resourceId } not a valid resource id for ${ value }.`);

          return true;
        })

       ]   
    }

    case 'stripeToken': {

      return [ 
 
         body('amount')
         .exists().withMessage("expected body param 'amount' not provided"),
         

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