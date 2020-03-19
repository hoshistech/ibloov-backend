const express = require('express');
const router = express.Router();
const passport = require("passport");
const { facebookLogin } = require('@controllers/auth/auth.controller');


//router.get("/facebook", passport.authenticate("facebook"));

//router.get("/facebook/callback", passport.authenticate("facebook", { successRedirect: "/", failureRedirect: "/fail"}));

router.get("/fail", (req, res) => {
    res.status(400).send("Failed attempt");
});

router.get("/", (req, res) => {
    res.status(200).send("Success");
});



module.exports = router; 