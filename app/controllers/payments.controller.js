const paymentService = require('@services/payment.service');

module.exports = {

    checkout: async (req, res) => {

        const { nonceFromTheClient, amount, currency, resource, resourceId } = req.body;

        console.log("nonceFromTheClient, amount, currency");
        console.log(nonceFromTheClient);
        console.log(amount);
        console.log(currency);

        try {
            
            const resp = await paymentService.checkout( amount, nonceFromTheClient, currency, req.authuser );

            if(! resp.success ){

                return res.status(400).json({
                    success: false,
                    message: resp.message,
                    data: resp
                });
            }

            const platform = req.authplatform
            const userId = req.authuser._id;

            //log payment
            paymentService.logPayment( resp, userId, platform, resource, resourceId );
            
            /**
             * Todo send receipt.
             */

            return res.status(200).json({
                success: true,
                message: "payment processing successful.",
                data: resp
            });

        } catch ( err ) {

            console.log( err )

            /**
             * Todo - it is super important to log failed payments.
             */
            
            return res.status(400).json({
                success: false,
                message: "Error occured while processing this payment!.",
                data: err.toString()
            });
        }
    },

    /**
     * generate server side token to process payment processing.
     * 
     */
    generate_client_token: async (req, res) => {

        try{
            let token = await paymentService.generateClientToken();
            return res.status(200).send({
                success: true,
                message: "token generated successfully",
                data: token
            });

        } catch( err ) {

            res.status(400).send({

                success: false,
                message: "Error occured while trying to generate this token.",
                data: err.toString()
            })
        }
    },


    stipePaymentIntent: async(req, res) => {

        try {
            
            const amount = req.body.amount * 100 ;
            const currency = req.body.currency ? req.body.currency.toLowerCase() : null;
            const resp = await paymentService.stripePaymentIntent(amount, currency );

            return res.status(200).send({
                success: true,
                message: "Operation successful",
                data: resp.client_secret
            });

        } catch ( err ) {

            res.status(400).send({

                success: false,
                message: "Error occured while trying to generate this token.",
                data: err.toString()
            })
        }
    },

    capturePayment: async( req, res) => {

        
        try {
            
            const paymentId = req.body.paymentId;
            const resp = await paymentService.stripePaymentCapture( paymentId );

            return res.status(200).send({

                success: true,
                message: "Operation successful",
                data: resp
            });

        } catch ( err ) {

            res.status(400).send({
                success: false,
                message: "Error occured while trying to generate this token.",
                data: err.toString()
            })
        }
    },

    webhook: async( req, res) => {

        let event;

    try {
        event = request.body;
        eventObject = event.data.object;

        // Handle the event
        switch ( event.type ) {
            
            /**
             * handle the successful payment intent.
             */
            case 'payment_intent.succeeded':
                return await handlePaymentIntentSucceeded(eventObject);
            break;

            /**
             * handle the successful attachment of a PaymentMethod.
             */
            case 'payment_method.attached':
                return await handlePaymentMethodAttached(eventObject);
            break;
                
            default:
                throw new Error("unrecognozed event.");
        }

    } catch (err) {
        res.status(400).send({
            success: false,
            message: "Error occured while trying to generate this token.",
            data: err.toString()
        })
    }
    }
}


const handlePaymentIntentSucceeded = function( paymentIntent ){

    console.log( paymentIntent );
}

const handlePaymentMethodAttached = function( paymentMehtod ){

    console.log( paymentMehtod );
}