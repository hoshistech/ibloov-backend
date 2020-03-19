
const express = require('express');
const router = express.Router();
const influencerController = require('@controllers/influencers.controller');
const {validate} = require("@request-middleware/influencer.request-middleware");
const { isValidRequest } = require("@middleware/isRequestValid.middleware");


router.patch('/follow/:influencerId', [ validate("followInfluencer"), isValidRequest ], influencerController.follow );

router.get('/:influencerId', [ validate("viewInfluencer"), isValidRequest  ], influencerController.view );

module.exports = router;
