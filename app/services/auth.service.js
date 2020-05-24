const JWT = require("jsonwebtoken");

module.exports = {

    signToken: async (user, platform) => {

        let expiresIn = ( platform == "web" ) ? process.env.JWT_TOKEN_VALIDATON_LENGTH_WEB : process.env.JWT_TOKEN_VALIDATON_LENGTH_MOBILE;


        return JWT.sign(
            { user, platform }, 
            process.env.JWT_SECRET_KEY, 
            { expiresIn }
        )
    }
}