module.exports.isAdmin = (req, res, next) => {

    if( req.authuser.type !== "admin"){

        res.status(400).json({

            success: false,
            message: "you are not authorized to carry out this operation."
        })
    }

    next();
}
