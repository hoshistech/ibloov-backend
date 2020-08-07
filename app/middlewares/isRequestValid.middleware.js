
const { validationResult } = require('express-validator');

module.exports.isValidRequest = (req, res, next) => {

    const errors = validationResult(req);

    if ( ! errors.isEmpty() ) {

        req.bugsnag.notify(errors);
        
        return res.status(422).send({
            
            success: false,
            message: "Your request has some validation errors",
            data: errors.array()
        });
    }

    next();
}
