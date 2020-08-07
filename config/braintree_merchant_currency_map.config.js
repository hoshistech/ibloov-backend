
module.exports.getMerchantId = ( currencyCode ) => {

    const defaul_merchant = process.env.BRAINTREE_MERCHANT_DEFAULT;

    const merchant_currency_map = {

        "NGN": process.env.BRAINTREE_MERCHANT_NGN
    }

    const merchant = merchant_currency_map[ currencyCode.toUpperCase() ];
    return merchant || defaul_merchant;
}