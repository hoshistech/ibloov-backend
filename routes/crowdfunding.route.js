const express = require('express');
const router = express.Router();
const CrowdFundingController = require('@controllers/crowdfundings.controller');

const { validate } = require("@request-middleware/crowdfunding.request-middleware");
const { isValidRequest } = require("@middleware/isRequestValid.middleware");

router.get('/', CrowdFundingController.index) ;

router.post('/create', [ validate("createCrowdfund"), isValidRequest ], CrowdFundingController.create );

router.patch('/:crowdFundingId', [ validate("updateCrowdfund"), isValidRequest ], CrowdFundingController.update );

router.get('/:crowdFundingId', [ validate("viewCrowdfund"), isValidRequest ], CrowdFundingController.view );

router.delete('/:crowdFundingId', [ validate("deleteCrowdfund"), isValidRequest ], CrowdFundingController.softdelete );

router.patch('/pledge/:crowdFundingId', [ validate("crowdfundPledge"), isValidRequest ], CrowdFundingController.pledge );

router.patch('/unpledge/:crowdFundingId', [ validate("crowdfundUnpledge"), isValidRequest ], CrowdFundingController.unpledge );

module.exports = router; 