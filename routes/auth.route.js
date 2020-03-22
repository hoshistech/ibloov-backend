const express = require('express');
const router = express.Router();
const passport = require("passport");
const { facebookLogin } = require('@controllers/auth/auth.controller');

const googleAuthController = require('@controllers/auth/google.auth.controller');


router.get("/google/authurl", googleAuthController.googleAuthUrl );

router.get("/google/accountDetail/:code", googleAuthController.getAccountDetail );

router.get("/fail", (req, res) => {
    res.status(400).send("Failed attempt"); 
});

router.get("/", (req, res) => {
    res.status(200).send("Success");
});



module.exports = router; 