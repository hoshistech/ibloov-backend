const express = require('express');
const router = express.Router();
const WishListController = require('@controllers/wishlists.controller');

const { validate } = require("@request-middleware/wishlist.request-middleware");
const { isValidRequest } = require("@middleware/isRequestValid.middleware");

router.get('/', WishListController.index ) ;

router.get('/create', WishListController.create ) ;

router.get('/:wishlistId', WishListController.view );

router.patch('/:wishlistId', WishListController.update );

router.patch('/invite/add/:wishlistId', [ validate("addInvites"), isValidRequest], WishListController.addInvites );

router.patch('/invite/remove/:wishlistId', [ validate("removeInvite"), isValidRequest], WishListController.removeInvites );

router.delete('/:wishlistId', WishListController.softdelete );

module.exports = router; 