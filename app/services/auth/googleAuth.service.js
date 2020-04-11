const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const userService = require("@services/user.service");

//credentials 
const { googleAuth } = require("@config/socialAuth");

module.exports = function(passport){ 

    passport.use( new GoogleStrategy( googleAuth,

        async (accessToken, refreshToken, profile, done) => {

            try {

                let user = await userService.getUser( {"google.id": profile.id} )
                if( user ) return done(null, user);

                let newUser =  {

                    authMethod: "google",
                    email: profile.email,
                    google: {
                    id: profile.id,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName, 
                    }
                }
                await userService.createUser( newUser );
                return done(null, newUser);
                
            } catch (err) {
                return done( err, false, err.toString() )
            }
        })
    );
}