const express = require('express');
const router = express.Router();
const EventController = require('@controllers/events.controller');

//middlewares
const { validate } = require("@request-middleware/event.request-middleware");
const { isValidRequest } = require("@middleware/isRequestValid.middleware");
const { checkAuth } = require("@middleware/auth.middleware");
const { checkAuthOptional } = require("@middleware/auth.optional.middleware");


const { deleteEvent } = require("@middleware/onlyOwner.middleware");

const middleWareGroup = [ checkAuth, validate("createEvent"), isValidRequest];

router.get('/', [ checkAuthOptional ], EventController.index ) ;

router.post('/create', middleWareGroup, EventController.create );

router.get('/live', [ checkAuthOptional ], EventController.live );

router.patch('/:eventId', [ checkAuth, validate("updateEvent"), isValidRequest ], EventController.update );

router.delete('/:eventId',  [ checkAuth, validate("deleteEvent"), isValidRequest, deleteEvent ], EventController.softdelete );

router.get('/code/generate', EventController.generateEventCode );

router.get('/invitelink', EventController.inviteLink );

router.get('/blooving/cities', EventController.bloovingCities );

router.get('/:eventId', [ checkAuthOptional, validate("viewEvent"), isValidRequest ], EventController.view );

router.patch('/follow/:eventId', [ checkAuth, validate("followEvent"), isValidRequest ], EventController.follow );

router.patch('/unfollow/:eventId', [ checkAuth, validate("unfollowEvent"), isValidRequest ], EventController.unfollow );

router.patch('/togglefollow/:eventId', [ checkAuth, validate("toggleFollowEvent"), isValidRequest ], EventController.toggleFollow );

router.patch('/togglelike/:eventId', [ checkAuth, validate("toggleLikeEvent"), isValidRequest ], EventController.toggleLike );

router.patch('/invite/setattendingstatus/:eventId', [ checkAuth, validate("confirmAttendance"), isValidRequest ], EventController.confirmAttendance );

router.patch('/notifications/mute/:eventId', [ checkAuth, validate("muteEventNotification"), isValidRequest ], EventController.muteNotifications ); 

router.patch('/invite/add/:eventId', [ checkAuth, validate("addInvite"), isValidRequest ], EventController.addInvites ); 

router.patch('/invite/remove/:eventId', [ checkAuth, validate("removeInvite"), isValidRequest ], EventController.removeInvites );

module.exports = router; 