
const express = require('express');
const router = express.Router();
const influencerController = require('@controllers/influencers.controller');

//middlewares
const { validate } = require("@request-middleware/influencer.request-middleware");
const { isValidRequest } = require("@middleware/isRequestValid.middleware");
const { checkAuth } = require("@middleware/auth.middleware");


router.patch('/follow/:influencerId', [ checkAuth, validate("followInfluencer"), isValidRequest ], influencerController.follow );

router.patch('/unfollow/:influencerId', [ checkAuth, validate("unfollowInfluencer"), isValidRequest ], influencerController.unfollow );

router.patch('/verify/:influencerId', [ checkAuth, validate("verifyInfluencer"), isValidRequest ], influencerController.verifyInfluencer );

router.patch('/:influencerId', [ checkAuth, validate("updateInfluencer"), isValidRequest ], influencerController.update );

router.delete('/:influencerId', [ checkAuth, validate("deleteInfluencer"), isValidRequest ], influencerController.softdelete );

router.get('/', [ checkAuth ], influencerController.index) ;

router.get('/:influencerId', [ checkAuth, validate("viewInfluencer"), isValidRequest ], influencerController.view );

router.post('/create', [ checkAuth, validate("createInfluencer"), isValidRequest ], influencerController.create );


module.exports = router; 
