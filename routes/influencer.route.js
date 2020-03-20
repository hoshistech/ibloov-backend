
const express = require('express');
const router = express.Router();
const influencerController = require('@controllers/influencers.controller');
const { validate } = require("@request-middleware/influencer.request-middleware");
const { isValidRequest } = require("@middleware/isRequestValid.middleware");


router.patch('/follow/:influencerId', [ validate("followInfluencer"), isValidRequest ], influencerController.follow );

router.patch('/unfollow/:influencerId', [ validate("unfollowInfluencer"), isValidRequest ], influencerController.unfollow );

router.patch('/:influencerId', [ validate("updateInfluencer"), isValidRequest ], influencerController.update );

router.delete('/:influencerId', [ validate("deleteInfluencer"), isValidRequest ], influencerController.softdelete );

router.get('/', influencerController.index) ;

router.get('/:influencerId', [ validate("viewInfluencer"), isValidRequest  ], influencerController.view );

router.post('/create', [ validate("createInfluencer"), isValidRequest ], influencerController.create );


module.exports = router; 
