const express = require('express');
const router = express.Router();
const WishListController = require('@controllers/wishlists.controller');

router.get('/', WishListController.index) ;


module.exports = router; 