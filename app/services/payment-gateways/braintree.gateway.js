const braintree = require('braintree');
const processor = require("@config/payment.config");

//get braintree credentials from config
const { merchantId, publicKey, privateKey } = processor;

const gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId,
  publicKey,
  privateKey
}); 

module.exports = {

    checkout: async (amount, nonceFromTheClient) => {

      try {

        return await gateway.transaction.sale({
          amount,
          paymentMethodNonce: nonceFromTheClient,
          options: {
            submitForSettlement: true
          }
        });
        
      } catch (err) {
          throw err;
      }
        
    },


    /**
     * Braintree requires a client token from its server SDK to validate payment processing on the client SDK
     * this token is generated and sent to the client for validating payment processing.
     */
    generateClientToken: async() => {

      try {
        let response = await gateway.clientToken.generate();
        return response.clientToken;

      } catch (err) {
        throw err;
      }
      
    }
}