const utilityService = require("@services/utility.service")

module.exports = {

    getQRResource: async(req, res) => {

        const qr = req.params.qr;
        const authuser = req.authuser._id;

        try {
            const resource = await utilityService.getQRResource( qr, authuser );
            return res.json({
                success: true,
                message: "Operation successful",
                data: resource
            })
            
        } catch ( err ) {

            return res.status(400).json({
                success: false,
                message: "An error occured while processing this request.",
                data: err.toString()
            })
            
        }
    }

}