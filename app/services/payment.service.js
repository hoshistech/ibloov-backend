const gateway = require("@services/payment-gateways/braintree.gateway");

module.exports = {

    checkout: async () => {

        try{
            return gateway.checkout(10);

        } catch(e) {
            throw e;
        }
    }
}