const jwt = require("jsonwebtoken");
const userService = require("@services/user.service");

module.exports.checkAuth = async function ( req, res, next ){

    const bearerHeader = req.headers["authorization"];

    if( typeof bearerHeader !== "undefined" ){

        let token = bearerHeader.split(" ")[1];
        req.token = token;
        verifyToken( req, res, next )

    } else {

        return res.status(403).json({
            success: false,
            message: "Authorization needed."
        })
    }
}

verifyToken = function( req, res, next ){

    jwt.verify( req.token, process.env.JWT_SECRET_KEY, (err, data) => {

        if( err ) {
            return res.status(401).json({
                success: false,
                message: "unauthorized",
                data: err.toString()
            })
        }

        //userService.getUser( { email: data.user.email })
        userService.getUser( { _id: data.user._id })
        .then( user => {

            if( ! user ){

                return res.status(401).json({

                    success: false,
                    message: "invalid token",
                })
            }

            req.authuser = user;
            next();
        })
        .catch( err => {

            return res.status(403).json({

                success: false,
                message: "unauthorized",
                data: err.toString()
            })

        })  
    })
}