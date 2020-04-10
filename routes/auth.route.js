const express = require('express');
const router = express.Router();
const passport = require("passport");
const { facebookLogin } = require('@controllers/auth/auth.controller');

const authController = require("@controllers/auth/auth.controller");

const googleAuthController = require('@controllers/auth/google.auth.controller');


/*********************************************************************************** */
router.get("/google/authurl", googleAuthController.googleAuthUrl );

//router.get("/google/accountDetail/:code", googleAuthController.getAccountDetail );
/************************************************************************************ */



router.get("/google",  passport.authenticate('google', { scope: ["profile", "email"] }),   );


router.get('/google/callback', passport.authenticate('google'), authController.googleAuth);

//router.get("/facebook",  passport.authenticate('google', { scope: ["profile"] }) );

//router.get("/facebook/callback",  passport.authenticate('google', { scope: ["profile"] }) );





module.exports = router; 