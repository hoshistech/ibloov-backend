const express = require('express');
const router = express.Router();
const passport = require("passport");

const authController = require("@controllers/auth/auth.controller");

const { validate } = require("@request-middleware/auth.request-middleware");
const { isValidRequest } = require("@middleware/isRequestValid.middleware");
const { setSocialAuthProvider } = require("@middleware/setSocialAuthProvider.middleware");


//google auth (used by only web for now)
router.get("/google",  passport.authenticate('google', { scope: ["profile", "email"] }), authController.socialRedirect );
router.get('/google/callback', setSocialAuthProvider("google"), passport.authenticate('google'), authController.socialRedirect);

//local auth
router.post('/local/:platform', validate("isValidPlatform"), isValidRequest, passport.authenticate('local'), authController.signUser );

//facebook auth (used by only web for now)
router.get("/facebook", passport.authenticate('facebook', { scope: [['user_about_me', 'email']] }) );
router.get("/facebook/callback", setSocialAuthProvider("facebook"), passport.authenticate('facebook', { scope: ['user_about_me', 'email'] }), authController.socialRedirect );

module.exports = router; 