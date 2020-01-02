const express = require('express');
const router = express.Router();
const UserSeeder = require('@seeders/users.seeder');

router.post('/create', UserSeeder.seedUsers);

module.exports = router; 