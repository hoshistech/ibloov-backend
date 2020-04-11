const JWT = require("jsonwebtoken");

module.exports = {

    signToken: async (user) => {

        return JWT.sign(
            { user }, 
            process.env.JWT_SECRET_KEY, 
            { expiresIn: process.env.JWT_TOKEN_VALIDATON_LENGTH }
        )
    },


    getAuthUser: async() => {

        return null;
    }
}