const paymentService = require('@services/payment.service');

module.exports = {

    checkout: async (req, res) => {

        let { nonceFromTheClient, amount } = req.body;

        try {
            
            let resp = await paymentService.checkout(amount, nonceFromTheClient);

            if(! resp.success ){

                return res.status(400).json({
                    success: false,
                    message: resp.message,
                    data: resp
                });
            }

            return res.status(200).json({
                success: true,
                message: "payment processing successful."
            });

        } catch (error) {
            
            return res.status(400).json({
                success: false,
                message: "Error occured while processing this payment!.",
                data: error.toString()
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