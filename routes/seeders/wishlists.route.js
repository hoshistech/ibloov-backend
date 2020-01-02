const express = require('express');
const router = express.Router();
const WishlistSeeder = require('@seeders/wishlists.seeder');

router.post('/create', WishlistSeeder.seedWishlists);

module.exports = router; 