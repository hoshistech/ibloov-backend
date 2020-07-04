const passport = require("passport");
const FacebookStrategy = require('passport-facebook').Strategy;
const userService = require("@services/user.service");

var { facebookAuth } = require("@config/socialAuth");


module.exports = function(passport){

    passport.use( new FacebookStrategy( facebookAuth,

        async ( accessToken, refreshToken, profile, done) => {

            console.log("profile is")
            console.log(profile)

            try {

                let query = {}

                query["$or"] = [
                    { "facebook.id": profile.id },
                    { email: profile.email }
                ]

                let user = await userService.getUser( {"facebook.id": profile.id} )

                console.log("user")
                console.log(user)

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

                console.log("user")
                console.log(createdUser)

                return done(null, createdUser);
                
            } catch (err) {
                return done( err, false, err.toString() )
            }
        })
    );
}