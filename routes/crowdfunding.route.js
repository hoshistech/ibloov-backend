const express = require('express');
const router = express.Router();
const CrowdFundingController = require('@controllers/crowdfundings.controller');

const { validate } = require("@request-middleware/crowdfunding.request-middleware");
const { isValidRequest } = require("@middleware/isRequestValid.middleware");

const { checkAuth } = require("@middleware/auth.middleware");

router.get('/', [checkAuth], CrowdFundingController.index) ;

router.post('/create', [ checkAuth, validate("createCrowdfund"), isValidRequest ], CrowdFundingController.create );

router.patch('/:crowdFundingId', [ checkAuth, validate("updateCrowdfund"), isValidRequest ], CrowdFundingController.update );

router.get('/:crowdFundingId', [ checkAuth, validate("viewCrowdfund"), isValidRequest ], CrowdFundingController.view );

router.delete('/:crowdFundingId', [ checkAuth, validate("deleteCrowdfund"), isValidRequest ], CrowdFundingController.softdelete );

router.patch('/pledge/:crowdFundingId', [ checkAuth, validate("crowdfundPledge"), isValidRequest ], CrowdFundingController.pledge );

router.patch('/unpledge/:crowdFundingId', [ checkAuth, validate("crowdfundUnpledge"), isValidRequest ], CrowdFundingController.unpledge );

module.exports = router; 