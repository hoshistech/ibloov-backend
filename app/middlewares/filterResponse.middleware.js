

module.exports.filterResponse = (req, res, next) => {

    if( ! req.authuser._id ){

        return res.status(403).json({
            success: false,
            message: "unauthorized",
            data: err.toString()
        })
    }
        //this should be updated 
        if( ! req.authuser.type || req.authuser.type !== "admin" ) 
            req.body.userId = req.authuser._id;

        next();
   
}
