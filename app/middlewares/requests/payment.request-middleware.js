const { body } = require('express-validator');

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
        .exists().withMessage("Transaction amount not provided"),

        body('nonceFromTheClient')
        .exists().withMessage("expected nonceFromTheClient value not provided.")
       ]   
    }
  }
}