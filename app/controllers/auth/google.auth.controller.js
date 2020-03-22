const googleAuthService = require("@services/auth/googleAuth.service");

module.exports = {

    googleAuthUrl: (req, res) => {

        let url = googleAuthService.urlGoogle();

        return res.status(200).json({
            success: true,
            message: "google auth url generated successfully.",
            data: url
        });
    },

    getAccountDetail: async (req, res) => {

        let code = req.params.code;
        try{
            let user = await googleAuthService.getGoogleAccountFromCode(code);
            console.log(user);
            res.send("done");
        } 
        catch(e)
        {
            console.log("There was an error!");
            console.log(e);
        }
    }
}