const express = require('express');
const router = express.Router();
const EventController = require('@controllers/events.controller');

//middlewares
const { validate } = require("@request-middleware/event.request-middleware");
const { isValidRequest } = require("@middleware/isRequestValid.middleware");
const { checkAuth } = require("@middleware/auth.middleware");

const middleWareGroup = [validate("createEvent"), isValidRequest, checkAuth];
const middleWareGroup2 = [validate("createEvent"), isValidRequest];

router.get('/', checkAuth, EventController.index) ;

router.post('/create', middleWareGroup, EventController.create );

router.get('/live', EventController.live );

router.patch('/:eventId', EventController.update );

router.get('/:eventId', [ validate("viewEvent"), isValidRequest ], EventController.view );

router.delete('/:eventId', EventController.softdelete );

router.get('/code/generate', EventController.generateEventCode );

router.get('/code/:eventCode', EventController.generateEventCode );

router.patch('/follow/:eventId', [ validate("followEvent"), isValidRequest ], EventController.follow );

router.patch('/unfollow/:eventId', [ validate("unfollowEvent"), isValidRequest ], EventController.unfollow );

router.post('/invite/setattendingstatus/:eventId', EventController.confirmAttendance );

router.patch('/notifications/mute/:eventId', [ validate("muteEventNotification"), isValidRequest ], EventController.muteNotifications ); 

router.patch('/invite/add/:eventId', [ validate("addInvite"), isValidRequest ], EventController.addInvites ); 

router.patch('/invite/remove/:eventId', EventController.removeInvites );


module.exports = router; 