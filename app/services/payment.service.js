const gateway = require("@services/payment-gateways/braintree.gateway");

//const Payment = require("@models/payment.model");

module.exports = { 


    /**
     * process payment checkout
     * @param amount Number
     * @param nonceFromTheClient String
     */
    checkout: async (amount, nonceFromTheClient) => {

        try{
            const response = await gateway.checkout(amount, nonceFromTheClient);

            console.log( "payment response" );
            console.log( response );

            return response;

        } catch(e) {
            throw e;
        }
    },

    /**
     * Generates a client token that is sent to the client side to authenticate the processing of a transaction.
     * 
     */
    generateClientToken: async () => {
        return gateway.generateClientToken();
    },


    /**
     * Logs every payment on the platform
     * @param response Object the reponse of the payment,
     * @param userId  String the _id of the user carrying out the transactions
     * @param channel String the channel the medium of payment - creditcard, applepay, paypal etc.
     * @param platform String the platform of request mobile or web usually.
     * 
     */
    logPayment: async ( paymentResponse, userId, channel, platform ) => {

        const newPayment = {

            userId,
            amount: payment.amount,
            currency: payment.currency,
            exchangeRate: 454.01,
            paymentRef: payment.reference,
            channel,
            platform,
            response: paymentResponse

        }
        // let payment = new Payment( newPayment );
        // return await payment.save();
    }
}