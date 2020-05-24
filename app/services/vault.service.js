const Vault = require("@models/vault.model");

module.exports = {


    findUser: async ( userId ) => {

        return await Vault.findOne( { userId });
    },

    /**
     * get a customer's token for a particular payment nonce
     */
    getCustomerPaymentMethodToken: async ( customerId ) => {

        return await Vault.findOne({ customerId });
    },

    saveCustomerPaymentMethodToken: async ( userId, customerId, token ) => {

        const vault =  new Vault({
            userId,
            customerId,
            token
        });

        await vault.save();

    }

}