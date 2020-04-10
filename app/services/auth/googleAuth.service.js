const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const userService = require("@services/user.service");
const User = require('@models/user.model');


const { googleAuth } = require("@config/socialAuth");


passport.use( new GoogleStrategy( googleAuth,

    async (accessToken, refreshToken, profile, done) => {

        try {

            let user = await userService.getUser( {"google.id": profile.id} )
            if( user ) return done(null, user);

            let newUser =  {

                authMethod: "google",
                google: {
                  id: profile.id,
                  firstName: profile.name.givenName,
                  lastName: profile.name.familyName,
                  email: profile.email
                }
            }
            await userService.createUser( newUser );
            return done(null, newUser);
            
        } catch (err) {
            return done( err, false, err.toString() )
        }
    }
  )
);