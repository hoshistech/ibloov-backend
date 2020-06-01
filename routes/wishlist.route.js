const express = require('express');
const router = express.Router();
const WishListController = require('@controllers/wishlists.controller');

const { validate } = require("@request-middleware/wishlist.request-middleware");
const { isValidRequest } = require("@middleware/isRequestValid.middleware");

const { checkAuth } = require("@middleware/auth.middleware");
const { filterResponse } = require("@middleware/filterResponse.middleware");


router.get('/', [ checkAuth ], WishListController.index ) ;

router.post('/create', [  checkAuth, validate("createWishlist"), isValidRequest ], WishListController.create ) ;

router.get('/:wishlistId', [  checkAuth, validate("viewWishlist"), isValidRequest ], WishListController.view );

router.patch('/:wishlistId', [  checkAuth, validate("updateWishlist"), isValidRequest ], WishListController.update );

router.patch('/invite/add/:wishlistId', [  checkAuth, validate("addInvites"), isValidRequest ], WishListController.addInvites );

router.patch('/invite/remove/:wishlistId', [  checkAuth, validate("removeInvite"), isValidRequest ], WishListController.removeInvites );

router.patch('/item/add/:wishlistId', [  checkAuth, validate("addItem"), isValidRequest ], WishListController.addItem );

router.patch('/item/remove/:wishlistId', [  checkAuth, validate("removeItem"), isValidRequest ], WishListController.removeItem );

router.patch('/item/pledge/:wishlistId', [  checkAuth, validate("pledgeItem"), isValidRequest ], WishListController.pledgeItem );

router.patch('/item/unpledge/:wishlistId', [  checkAuth, validate("unpledgeItem"), isValidRequest ], WishListController.unpledgeItem );

router.delete('/:wishlistId', [  checkAuth, validate("deleteWishlist"), isValidRequest ], WishListController.softdelete );




module.exports = router; 