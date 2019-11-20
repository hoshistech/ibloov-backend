const express = require('express');
const router = express.Router();
const {facebookLogin} = require('@controllers/auth/auth.controller');

router.post('/facebook/login', facebookLogin );

module.exports = router; 