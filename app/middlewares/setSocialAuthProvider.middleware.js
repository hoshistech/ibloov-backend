module.exports.setSocialAuthProvider = ( socialAuthProvider ) => {
    
    return (req, res, next) => {

        req.socialAuthProvider = socialAuthProvider;
        next();
    };   
}