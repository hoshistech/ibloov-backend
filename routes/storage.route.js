
const express = require('express');
const router = express.Router();

//controller 
const storageController = require('@controllers/storage.controller');
const { checkAuth } = require("@middleware/auth.middleware");

//middlewares
const { validate } = require("@request-middleware/storage.request-middleware");
const { isValidRequest } = require("@middleware/isRequestValid.middleware");

router.post('/upload', [ checkAuth, validate("upload"), isValidRequest ], storageController.upload );

module.exports = router;