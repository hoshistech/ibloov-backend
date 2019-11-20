const  passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require("@models/user.model");
const {facebook} = require('@config/app.config');

passport.use( new FacebookStrategy({
    clientID: facebook.app_id,
    clientSecret: facebook.app_secret,
    callbackURL: facebook.callback
},

function( accessToken, refreshToken, profile, cb ) {

    User.findOrCreate( { facebookId: profile.id } , function(err, user) {
      return cb(err, user);
    });
  }
));

//const facebook = social.facebook;

facebookLogin = (req, res) => {

    

};


module.exports = {facebookLogin};