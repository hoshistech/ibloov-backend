const express = require('express');
const router = express.Router();
const CrowdFundingController = require('@controllers/crowdfundings.controller');

router.get('/', CrowdFundingController.index) ;

router.post('/create', CrowdFundingController.create );

router.patch('/:crowdFundingId', CrowdFundingController.update );

router.get('/:crowdFundingId', CrowdFundingController.view );

router.delete('/:crowdFundingId', CrowdFundingController.softdelete );

router.patch('/pledge/:crowdFundingId', CrowdFundingController.pledge );

router.patch('/unpledge/:crowdFundingId', CrowdFundingController.unpledge );

module.exports = router; 