const gateways = {

    braintree: {

        merchantId: process.env.BRAINTREE_MERCHANT_ID,
        publicKey: process.env.BRAINTREE_PUBLIC_KEY,
        privateKey: process.env.BRAINTREE_PRIVATE_KEY
    }
}

const default_gateway = process.env.DEFAULT_PAYMENT_GATEWAY;
module.exports = gateways[default_gateway];