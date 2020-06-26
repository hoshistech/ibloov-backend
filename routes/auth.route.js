const express = require('express');
const router = express.Router();
const passport = require("passport");

const authController = require("@controllers/auth/auth.controller");
const googleAuthController = require('@controllers/auth/google.auth.controller');

const { validate } = require("@request-middleware/auth.request-middleware");
const { isValidRequest } = require("@middleware/isRequestValid.middleware");


/*********************************************************************************** */
router.get("/google/authurl", googleAuthController.googleAuthUrl );

//router.get("/google/accountDetail/:code", googleAuthController.getAccountDetail );
/************************************************************************************ */



router.get("/google",  passport.authenticate('google', { scope: ["profile", "email"] }), authController.signUser );

router.get('/google/callback', passport.authenticate('google'), authController.signUser);

router.post('/local/:platform', validate("isValidPlatform"), isValidRequest, passport.authenticate('local'), authController.signUser );

//router.get("/facebook",  passport.authenticate('google', { scope: ["profile"] }) );

router.get("/facebook/callback",  passport.authenticate('facebook'), authController.signUser );

module.exports = router; 