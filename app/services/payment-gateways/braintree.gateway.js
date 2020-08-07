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

    checkout: async ( amount, paymentMethodNonce, merchantAccountId) => {

      try {

        return await gateway.transaction.sale({
          amount,
          paymentMethodNonce,

          /** Set the merchantAccountId to use for this transaction */
          /** this would help with multi-currency transactions */
          /** e.g you can use merchantId setup for a naira merchant account to process naira transactions  */
          /** Default is used if nothing is provided.  */
          merchantAccountId,

          /** To use a vaulted payment method */
          //paymentMethodToken: tokenFromVaultOnInitailCreation,

          /** passing in a customerId does one of the following */
          /** uses the customer's default payment method ( which defaults to the first payment method by the user, if it is not later updated ) */
          /** Associates this transaction's payment method with an existing customer - note, you can set a key in option to prevent duplicates */
          //customerId: customerId,

          /** optional - device data from the client  */
          /** used with advanced fraud management */
          //deviceData: req.body.device_data,

          options: {
            submitForSettlement: true,

            /** Creates a new payment in valut for a customer */
            /** typically used when storing a payment method for a new customer or an exisiting customer */
            /** when it is for a new customer, make sure to pass the "customer" object */
            /** when it is for an existing customer, make sure to pass the "customerId" key */
            //storeInVaultOnSuccess: true
          },

          /** when creating a new customer with a new payment method */
          // customer: {
          //   id: customerId  
          // }
        });
        
      } catch (err) {

          throw err;
      }
        
    },


    /**
     * Braintree requires a client token from its server SDK to validate payment processing on the client SDK
     * this token is generated and sent to the client for validating payment processing.
     */
    generateClientToken: async () => {

      try {
        let response = await gateway.clientToken.generate();
        return response.clientToken;

      } catch (err) {
        throw err;
      }
      
    },

    /**
     * To create a new payment method for an existing customer
     * The only required attributes are the customer ID and payment method nonce.
     */
    newPaymentMethod: async( customerId, paymentMethodNonce ) => {

      try{

        return await gateway.paymentMethod.create({
          customerId,
          paymentMethodNonce,

          /** Specifies a billing address when creating a new payment method */
          /** Note that the specified billing address will override any address specified during nonce creation */
          // billingAddress: {
          //   streetAddress: "123 Abc Way"
          // },

          options: {

            /** prevents duplicate payment methods */
            failOnDuplicatePaymentMethod: true,

            /** this can be set in the dashboard at a more global level */
            /** Note: By default braintree we will run credit card validations but not perform verification */
            /** this option is to manually perform verfication*/
            //verifyCard: true,

            /** both keys below are possibly optional */
            //verificationMerchantAccountId: "theMerchantAccountId",
            //verificationAmount: "2.00",
            
            /** optional - device data from the client  */
            /** used with advanced fraud management */
            //deviceData: req.body.device_data,

            /** To make this the default set to true */
            //makeDefault: true,
          }
        })

      } catch( err ){

        throw err;
      }
    },


    newCustomerWithPaymentMethod: async( customer, paymentMethodNonce  ) => {


      try {

        return await gateway.customer.create({  

          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
  
          /** You can also create a customer with an associated payment method */
          paymentMethodNonce
  
        });
        
      } catch ( err ) {

        throw err;
        
      }
    },


    /**
     * Create a payment method nonce 
     * 
     * @param paymentMethodToken String
     */
    createPaymentMethodNonce: async( paymentMethodToken ) => {

      const response = await gateway.paymentMethodNonce.create(paymentMethodToken);
      return response.paymentMethodNonce.nonce;
    }
}