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
                    { email: profile.emails[0].value }
                ]

                let user = await userService.getUser( query )

                if( user ) return done(null, user);

                if( user ){

                    //update the use
                    if( ! user.facebook.id || Object.entries(user.facebook).length === 0  ){

                        let update = {
                            id: profile.id,
                            firstName: profile.name.familyName,
                            lastName: profile.name.givenName  
                        }

                        await userService.updateUser(user._id, { "facebook": update } );

                    }

                    return done(null, user);
                }

                let newUser =  {

                    authMethod: "facebook",
                    email: profile.emails[0].value,
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