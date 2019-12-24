const express = require('express');
const router = express.Router();
const WishlistSeeder = require('@seeders/wishlists.seeder');

router.get('/create', WishlistSeeder.seedWishlists);

module.exports = router; 