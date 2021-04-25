const authService = require("@services/auth.service");

module.exports = {

    signUser: async (req, res) => {

        try {

            const platform = req.params.platform;

            const token = await authService.signToken(req.user, platform);

            return res.status(200).json({

                success: true,
                message: "Operation successful",
                data: token
            })

        } catch (err) {

            return res.status(400).json({

                success: true,
                message: "error occured while performing this operation.",
                data: err.toString()
            })
        }
    },

    socialRedirect: async (req, res) => {

        try {

            /**
             * Todo - fix this 
             * platform from social login should be provided.
             */
            const platform = req.query.platform;
            const token = await authService.signToken(req.user, platform);
            const socialAuthProvider = req.socialAuthProvider;

            return res.redirect(`${process.env.FRONTEND_BASE_URL}/social/${socialAuthProvider}/${token}`)

        } catch (err) {

            return res.status(400).json({

                success: true,
                message: "error occured while performing this operation.",
                data: err.toString()
            })
        }
    }
}