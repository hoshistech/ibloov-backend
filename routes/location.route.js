var express = require('express');
var router = express.Router();

const LocationController = require('@controllers/location.controller');

router.get("/search", LocationController.search);

module.exports = router;