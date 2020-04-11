
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const userService = require("@services/user.service");


module.exports = function(passport){


    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser( async function(id, done) {

        try{
            let user = await userService.viewUser(id);

            if( ! user ) return done( null, false )

            done( null, user );

        } catch ( err ){

            done( err, false, err.toString() )
        }
    });

    passport.use( new LocalStrategy(

        { usernameField: "email" },

        async (email, password, done) => {

            console.log(email, password);

            try {

                let user = await userService.getUser( { email } );

                console.log(user);
                if( ! user) return done(null, false);

                if ( ! user.isValidPassword( password ) ) return done( null, false )

                done(null, user);
                
            } catch ( err ) {

                return done( err, false, err.toString() )
                
            }
        }
    ));
}


