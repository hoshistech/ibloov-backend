const express = require('express');
const router = express.Router();
const RequestSeeder = require('@seeders/request.seeder');

router.post('/create', RequestSeeder.seedRequests);

module.exports = router; 