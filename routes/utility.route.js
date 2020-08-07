
const express = require('express');
const router = express.Router();

//controller 
const utilityController = require('@controllers/utility.controller');


//middlewares
const { validate } = require("@request-middleware/utility.request-middleware");
const { isValidRequest } = require("@middleware/isRequestValid.middleware");
const { checkAuth } = require("@middleware/auth.middleware");

router.get('/qr/resource/:qr', [ checkAuth, validate("qrresource"), isValidRequest ], utilityController.getQRResource );

module.exports = router;