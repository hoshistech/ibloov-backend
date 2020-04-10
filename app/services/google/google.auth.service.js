// var passport = require('passport');
// var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
// const { googleAuth } = require("@config/socialAuth");
// const User = require("@models/user.model");


// passport.use(
    
//     new GoogleStrategy( googleAuth,

//         function( accessToken, refreshToken, profile, done) {

//             User.findOrCreate({ googleId: profile.id }, function (err, user) {
//                 return done(err, user);
//             }); 
//         }
//     )   
// );