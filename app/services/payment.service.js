const gateway = require("@services/payment-gateways/braintree.gateway");

module.exports = {


    /**
     * process payment checkout
     * @param amount Number
     * @param nonceFromTheClient String
     */
    checkout: async (amount, nonceFromTheClient) => {

        try{
            return gateway.checkout(amount, nonceFromTheClient);

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
    }
}