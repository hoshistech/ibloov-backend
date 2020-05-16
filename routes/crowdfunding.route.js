const express = require('express');
const router = express.Router();
const CrowdFundingController = require('@controllers/crowdfundings.controller');

const { validate } = require("@request-middleware/crowdfunding.request-middleware");
const { isValidRequest } = require("@middleware/isRequestValid.middleware");

const { checkAuth } = require("@middleware/auth.middleware");

router.get('/', [ checkAuth ], CrowdFundingController.index) ;

router.post('/create', [ checkAuth, validate("createCrowdfund"), isValidRequest ], CrowdFundingController.create );

router.patch('/:crowdfundingId', [ checkAuth, validate("updateCrowdfund"), isValidRequest ], CrowdFundingController.update );

router.get('/invitelink', CrowdFundingController.inviteLink );

router.get('/:crowdfundingId', [ checkAuth, validate("viewCrowdfund"), isValidRequest ], CrowdFundingController.view );

router.delete('/:crowdfundingId', [ checkAuth, validate("deleteCrowdfund"), isValidRequest ], CrowdFundingController.softdelete );

router.patch('/pledge/:crowdfundingId', [ checkAuth, validate("crowdfundPledge"), isValidRequest ], CrowdFundingController.pledge );

router.patch('/unpledge/:crowdfundingId', [ checkAuth, validate("crowdfundUnpledge"), isValidRequest ], CrowdFundingController.unpledge );

router.patch('/invite/add/:crowdfundingId', [ checkAuth, validate("addInvite"), isValidRequest ], CrowdFundingController.addInvites ); 

router.patch('/invite/remove/:crowdfundingId', [ checkAuth, validate("removeInvite"), isValidRequest ], CrowdFundingController.removeInvites );

module.exports = router; 