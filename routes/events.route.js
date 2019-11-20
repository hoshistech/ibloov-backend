const express = require('express');
const router = express.Router();
const EventController = require('@controllers/events.controller');

router.get('/v1/events', EventController.index) ;

//router.get('/v1/event/create', EventController.create);


module.exports = router; 