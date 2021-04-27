
const { validationResult } = require('express-validator');

module.exports.isValidRequest = (req, res, next) => {

    const errors = validationResult(req);

    if ( ! errors.isEmpty() ) {

        req.bugsnag.notify(errors);
        
        return res.status(422).send({
            
            success: false,
            message: errors.array()[0].msg,
            error: errors.array(),
            data: null
        });
    }

    next();
}
