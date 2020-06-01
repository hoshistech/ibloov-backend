const requestService = require('@services/request.service');

module.exports = {

    /**
     * @RESTCONTROLLER
     * endpoint to retreive a list of groups
     * 
     * @authlevel authenticated
     */
    accept: async (req, res) => {

        const requestId = req.params.requestId;

        try {
            await requestService.acceptRequest(requestId);

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
     * endpoint to create a new group.
     */
    deny: async (req, res) => {

        const requestId = req.params.requestId;

        try {
            await requestService.denyRequest(requestId);

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