const passport = require("passport");
const FacebookStrategy = require('passport-facebook').Strategy;
const userService = require("@services/user.service");

var { facebookAuth } = require("@config/socialAuth");

module.exports = function(passport){

    passport.use( new FacebookStrategy( facebookAuth,

        async (accessToken, refreshToken, profile, done) => {

            console.log("profile");
            console.log(profile);

            try {

                let user = await userService.getUser( {"facebook.id": profile.id} )
                if( user ) return done(null, user);

                let newUser =  {

                    authMethod: "facebook",
                    email: profile.email,
                    facebook: {
                        id: profile.id,
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName, 
                    }
                }
                let createdUser = await userService.createUser( newUser );
                return done(null, createdUser);
                
            } catch (err) {
                return done( err, false, err.toString() )
            }
        })
    );
}