const gateway = require("@services/payment-gateways/braintree.gateway");

//model
const Payment = require("@models/payment.model");

const { getMerchantId } = require("@config/braintree_merchant_currency_map.config");

//const vaultService = require("@services/vault.service");

module.exports = { 


    /**
     * process payment checkout
     * @param amount Number
     * @param nonceFromTheClient String
     */
    checkout: async ( amount, nonceFromTheClient, currency, authuser ) => {

        try{

            const merchantAccountId = getMerchantId(currency);
            return await gateway.checkout(amount, nonceFromTheClient, merchantAccountId );

        } catch( err ) {
            
            throw err;
        }
    },


    // //


    //     //vaultService.customerExists
    //     /**
    //      * Todo check if the customer exists in the vault - if not create user with a nonce
    //      * Todo set merchantId to use
    //      * 
    //      */

    //     try{
    //         //return await gateway.checkout(amount, nonceFromTheClient);

    //         let resp;

    //         let vaultedUser = await vaultService.findUser( authuser._id );

    //         console.log( "vaultedUser" );
    //         console.log( vaultedUser );

    //         if( vaultedUser ){

    //             console.log("eee")
    //             resp = await gateway.newPaymentMethod( vaultedUser.customerId, nonceFromTheClient );

    //             console.log("resp -> vaultedUser ")
    //             console.log(resp)

    //             if(! resp.success){
    //                 throw new Error( resp.message );
    //             }
               
    //             console.log("resp -> vaultedUser ")
    //             console.log(resp)

    //         } else {

    //             console.log("fff")
    //             resp = await gateway.newCustomerWithPaymentMethod( authuser, nonceFromTheClient );

    //             if(! resp.success){
    //                 throw new Error( resp.message );
    //             }
    //             console.log("resp -> ! vaultedUser ")
    //             console.log(resp)

    //             await vaultService.saveCustomerPaymentMethodToken( authuser._id, resp.customer.id, resp.customer.paymentMethods[0].token );

    //         }
            
    //         console.log( "resp" );
    //         console.log( resp )
    //         return resp;

    //     } catch( err ) {
            
    //         throw err;
    //     }
    // },

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
     * @param platform String the platform from which the request was made ( mobile or web usually ).
     * @param resource String the resource that is being paid for
     * @param resourceId String the _id of the resource being paid for.
     * 
     */
    logPayment: async ( paymentResponse, userId, platform, resource, resourceId ) => {

        const newPayment = { 

            userId,
            resource,
            resourceId,
            amount: paymentResponse.transaction.amount,
            currency: paymentResponse.transaction.currencyIsoCode,
            paymentRef: paymentResponse.transaction.id,
            channel: paymentResponse.transaction.paymentInstrumentType,
            platform,
            response: paymentResponse

        }

        let payment = new Payment( newPayment );
        return await payment.save();
    }
}