const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


module.exports = {

    paymentIntent: async ( amount, currency  ) => {

        return await stripe.paymentIntents.create({

            amount,
            currency,
            // payment_method_types: ['card'],
            // receipt_email,
            metadata: { integration_check: 'accept_a_payment'},
        });
    },

    /**
     * captures Stripe payment.
     * 
     */
    capturePayment: async( paymentId ) => {

        return await stripe.paymentIntents.capture(paymentId);
    }
}