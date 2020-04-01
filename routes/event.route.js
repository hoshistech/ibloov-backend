const express = require('express');
const router = express.Router();
const EventController = require('@controllers/events.controller');

router.get('/', EventController.index) ;

router.post('/create', EventController.create );

router.get('/live', EventController.live );

router.patch('/:eventId', EventController.update );

router.get('/:eventId', EventController.view );

router.delete('/:eventId', EventController.softdelete );

router.get('/code/generate', EventController.generateEventCode );

router.get('/code/:eventCode', EventController.generateEventCode );

router.patch('/follow/:eventId', EventController.follow );

router.patch('/unfollow/:eventId', EventController.unfollow );

router.post('/invite/setattendingstatus/:eventId', EventController.confirmAttendance );

router.patch('/notifications/mute/:eventId', EventController.muteNotifications );

router.patch('/invite/add/:eventId', EventController.addInvites );

router.patch('/invite/remove/:eventId', EventController.removeInvites );


module.exports = router; 