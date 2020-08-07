const express = require('express');
const router = express.Router();
const RequestController = require('@controllers/request.controller');


//middlewares
const { validate } = require("@request-middleware/request.request-middleware");
const { isValidRequest } = require("@middleware/isRequestValid.middleware");
const { checkAuth } = require("@middleware/auth.middleware");

router.post('/accept/:requestId', [ checkAuth, validate("acceptRequest"), isValidRequest  ], RequestController.accept);

router.post('/deny/:requestId', [ checkAuth, validate("denyRequest"), isValidRequest  ], RequestController.deny);

module.exports = router;