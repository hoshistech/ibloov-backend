const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const userService = require("@services/user.service");

//credentials 
const { googleAuth } = require("@config/socialAuth");

module.exports = function(passport){ 

    passport.use( new GoogleStrategy( googleAuth,

        async ( accessToken, refreshToken, profile, done ) => {

            try {

                let query = {}

                query["$or"] = [
                    { "google.id": profile.id },
                    { email: profile.email }
                ]

                let user = await userService.getUser( query );

                if( user ){

                    //update the ise
                    if( ! user.google.id ){

                        let update = {
                            id: profile.id,
                            firstName: profile.name.givenName,
                            lastName: profile.name.familyName, 
                        }

                        await userService.updateUser(user._id, { "google": update } );

                    }

                    return done(null, user);
                }

                let newUser =  {

                    authMethod: "google",
                    email: profile.email,
                    google: {
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