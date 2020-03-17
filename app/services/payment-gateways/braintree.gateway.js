var braintree = require('braintree');
const processor = require("@config/payment.config") 

module.exports = {

    checkout: async (amount, nonceFromTheClient) => {

        const {merchantId, publicKey, privateKey } = processor;
        var gateway = braintree.connect({

            environment: braintree.Environment.Sandbox,
            merchantId,
            publicKey,
            privateKey
          });
        
          // Use the payment method nonce here
          //var nonceFromTheClient = req.body.paymentMethodNonce;

          // Create a new transaction 
        //   var newTransaction = gateway.transaction.sale({
        //     amount: amount,
        //     paymentMethodNonce: nonceFromTheClient,
        //     options: {
        //       // This option requests the funds from the transaction
        //       // once it has been authorized successfully
        //       submitForSettlement: true
        //     }
        //   }, function(error, result) {
        //       if (result) {
        //         res.send(result);
        //       } else {
        //         res.status(500).send(error);
        //       }
        //   });


        return await gateway.transaction.sale({
            amount: amount,
            paymentMethodNonce: nonceFromTheClient,
            options: {
              // This option requests the funds from the transaction
              // once it has been authorized successfully
              submitForSettlement: true
            }
        });
    }
}