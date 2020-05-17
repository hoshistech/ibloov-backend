const { checkAuth } = require("./auth.middleware");

module.exports.checkAuthOptional= async function ( req, res, next ){

    const bearerHeader = req.headers["authorization"];

    if( typeof bearerHeader !== "undefined" ){

        checkAuth(req, res, next)

    } else {
        next();
    }
}
