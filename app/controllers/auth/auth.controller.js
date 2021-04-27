const authService = require("@services/auth.service");
const passport = require("passport");

module.exports = {

    signUser: async (req, res, next ) => {


        try {

            passport.authenticate('local', async function(err, user, info) {

                if(! user ){
                    return res.status(401).json({

                        success: false,
                        message: "Invalid username/password combination",
                        error: null,
                        data: null

                    })
                }

                const platform = req.params.platform;
                const token = await authService.signToken(user, platform);

                return res.status(200).json({

                    success: true,
                    message: "Operation successful",
                    data: token,
                    error: null
                })
                
            })(req, res, next);

        
        } catch (err) {

            res.handleRequestError(err);
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