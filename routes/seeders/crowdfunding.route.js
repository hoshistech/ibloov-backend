const express = require('express');
const router = express.Router();
const CrowdFundingSeeder = require('@seeders/crowdfunding.seeder');

router.post('/create', CrowdFundingSeeder.seedCrowdFundings);

module.exports = router; 