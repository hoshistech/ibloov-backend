const googleAuthService = require("@services/auth/googleAuth.service");

module.exports = {

    googleAuthUrl: (req, res) => {

        let url = googleAuthService.urlGoogle();

        return res.status(200).json({
            success: true,
            message: "google auth url generated successfully.",
            data: url
        });
    }

    
}