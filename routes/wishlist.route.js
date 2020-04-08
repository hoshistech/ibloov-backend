const express = require('express');
const router = express.Router();
const WishListController = require('@controllers/wishlists.controller');

const { validate } = require("@request-middleware/wishlist.request-middleware");
const { isValidRequest } = require("@middleware/isRequestValid.middleware");

router.get('/', WishListController.index ) ;

router.post('/create', [ validate("createWishlist"), isValidRequest], WishListController.create ) ;

router.get('/:wishlistId', [ validate("viewWishlist"), isValidRequest], WishListController.view );

router.patch('/:wishlistId', [ validate("updateWishlist"), isValidRequest], WishListController.update );

router.patch('/invite/add/:wishlistId', [ validate("addInvites"), isValidRequest], WishListController.addInvites );

router.patch('/invite/remove/:wishlistId', [ validate("removeInvite"), isValidRequest], WishListController.removeInvites );

router.patch('/item/add/:wishlistId', [ validate("addItem"), isValidRequest], WishListController.addItem );

router.patch('/item/remove/:wishlistId', [ validate("removeItem"), isValidRequest], WishListController.removeItem );

router.patch('/item/pledge/:wishlistId', [ validate("pledgeItem"), isValidRequest], WishListController.pledgeItem );

router.patch('/item/unpledge/:wishlistId', [ validate("unpledgeItem"), isValidRequest], WishListController.unpledgeItem );

router.delete('/:wishlistId', [ validate("deleteWishlist"), isValidRequest], WishListController.softdelete );




module.exports = router; 