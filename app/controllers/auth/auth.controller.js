// const  passport = require('passport');
// const FacebookStrategy = require('passport-facebook').Strategy;
// const User = require("@models/user.model");
// const {facebook} = require('@config/app.config');

// passport.serializeUser(function(user, done) {
//   done(null, user);
// });

// passport.deserializeUser(function(obj, done) {
//   done(null, obj);
// });

// passport.use( new FacebookStrategy({
//     clientID: facebook.app_id,
//     clientSecret: facebook.app_secret,
//     callbackURL: facebook.callback,
//     profileFields: ["email", "name"]
// },

// function( accessToken, refreshToken, profile, cb ) {

//    const { email, first_name, last_name } = profile._json;
//    const userData = {
//     email,
//     firstName: first_name,
//     lastName: last_name
//   };
//     User.findOrCreate( { facebookId: profile.id } , function(err, user) {
//       return cb(err, user);
//     });
//   }
// ));

// //const facebook = social.facebook;

// facebookLogin = (req, res) => {

    

// };


// module.exports = {facebookLogin};