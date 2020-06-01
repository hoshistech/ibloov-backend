const authService = require("@services/auth.service");

module.exports = {

    signUser: async (req, res) => {

        try {

            const token = await authService.signToken( req.user );

            return res.status(200).json({

                success: true,
                message: "Operation successful",
                data: token
            })
            
        } catch ( err ) {

            return res.status(400).json({

                success: true,
                message: "error occured while performing this operation.",
                data: err.toString()
            })
            
        }
    }

}