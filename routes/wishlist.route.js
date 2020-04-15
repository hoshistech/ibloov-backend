const express = require('express');
const router = express.Router();
const WishListController = require('@controllers/wishlists.controller');

const { validate } = require("@request-middleware/wishlist.request-middleware");
const { isValidRequest } = require("@middleware/isRequestValid.middleware");

const { checkAuth } = require("@middleware/auth.middleware");
const { filterResponse } = require("@middleware/filterResponse.middleware");


//router.get('/test', WishListController.test ) ;

router.get('/', [ checkAuth ], WishListController.index ) ;

router.post('/create', [ validate("createWishlist"), isValidRequest, checkAuth ], WishListController.create ) ;

router.get('/:wishlistId', [ validate("viewWishlist"), isValidRequest, checkAuth ], WishListController.view );

router.patch('/:wishlistId', [ validate("updateWishlist"), isValidRequest, checkAuth ], WishListController.update );

router.patch('/invite/add/:wishlistId', [ validate("addInvites"), isValidRequest, checkAuth ], WishListController.addInvites );

router.patch('/invite/remove/:wishlistId', [ validate("removeInvite"), isValidRequest, checkAuth ], WishListController.removeInvites );

router.patch('/item/add/:wishlistId', [ validate("addItem"), isValidRequest, checkAuth ], WishListController.addItem );

router.patch('/item/remove/:wishlistId', [ validate("removeItem"), isValidRequest, checkAuth ], WishListController.removeItem );

router.patch('/item/pledge/:wishlistId', [ validate("pledgeItem"), isValidRequest, checkAuth ], WishListController.pledgeItem );

router.patch('/item/unpledge/:wishlistId', [ validate("unpledgeItem"), isValidRequest, checkAuth ], WishListController.unpledgeItem );

router.delete('/:wishlistId', [ validate("deleteWishlist"), isValidRequest, checkAuth ], WishListController.softdelete );




module.exports = router; 