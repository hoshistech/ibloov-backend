const paymentService = require('@services/payment.service');

module.exports = {

    checkout: async (req, res) => {

        let { nonceFromTheClient, amount, currency } = req.body;

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

            paymentService.logPayment( resp, userId, platform )
            
            /**
             * @Todo log payment
             * @Todo send receipt.
             */

            return res.status(200).json({
                success: true,
                message: "payment processing successful.",
                data: resp
            });

        } catch ( err ) {

            console.log( err )
            
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

        } catch(e) {

            res.status(400).send({
                success: true,
                message: "Error occured while trying to generate this token.",
                data: e.toString()
            })
        }
    }
}