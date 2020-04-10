const express = require('express');
const router = express.Router();
const InfluencerSeeder = require('@seeders/influencers.seeder');

router.post('/create', InfluencerSeeder.seedInfluencers);

module.exports = router; 