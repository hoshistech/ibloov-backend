const { acceptRequest, denyRequest } = require('@services/request.service');

module.exports = {

    /**
     * @RESTCONTROLLER
     * endpoint to process accepting a request
     * 
     * @authlevel authenticated
     */
    accept: async (req, res) => {

        const requestId = req.params.requestId;

        try {
            await acceptRequest( requestId );

            res.status(200).send({
                success: true,
                message: "Operation successful",
            });

        } catch ( err ) {

            res.status(400).send({
                success: false,
                message: "error performing this operation",
                data: err.toString()
            });
        }
    },


    /**
     * @RESTCONTROLLER
     * endpoint to process rejecting a request
     */
    deny: async (req, res) => {

        const requestId = req.params.requestId;

        try {
            await denyRequest( requestId );

            res.status(200).send({
                success: true,
                message: "Operation successful",
            });

        } catch ( err ) {

            res.status(400).send({
                success: false,
                message: "error performing this operation",
                data: err.toString()
            });
        }
    }
}