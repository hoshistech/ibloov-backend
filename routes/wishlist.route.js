const express = require('express');
const router = express.Router();
const WishListController = require('@controllers/wishlists.controller');

router.get('/', WishListController.index ) ;

router.get('/create', WishListController.create ) ;

router.get('/:wishlistId', WishListController.view );

router.patch('/:wishlistId', WishListController.update );

router.delete('/:wishlistId', WishListController.softdelete );

module.exports = router; 