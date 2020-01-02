const express = require('express');
const router = express.Router();
const EventSeeder = require('@seeders/events.seeder');

router.post('/create', EventSeeder.seedEvents);

module.exports = router; 