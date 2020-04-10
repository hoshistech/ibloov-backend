const express = require('express');
const router = express.Router();
const CrowdFundingSeeder = require('@seeders/crowdfundings.seeder');

router.post('/create', CrowdFundingSeeder.seedCrowdFundings);

module.exports = router; 