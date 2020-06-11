const uuidv4 = require('uuid/v4');

//services
const wishlistService = require('@services/wishlist.service');


//helpers
const { getOptions, getMatch } = require('@helpers/request.helper');
const pagination = require('@helpers/pagination.helper'); 

module.exports = {

    index: async (req, res) => {

        let filter = getMatch(req);
        let options = getOptions(req);
        filter["deletedAt"] = null;

        try{
            let [ wishlists, wishlistCount ] = await Promise.all([
                wishlistService.all(filter, options),
                wishlistService.allCount(filter)
            ]);

            res.status(200).send({

                success: true,
                message: "Wishlist retreived succesfully",
                data: wishlists,
                pagination: pagination( wishlistCount, options, filter, "wishlist" )
            });
        }
        catch( err ){

            res.status(400).send({
                success: false,
                message: "error performing this operation",
                data: err.toString()
            });
        }
    },


    /**
     * create a new wishlist
     */
    create: async (req, res) => {

        let wishlist = req.body;
        wishlist.userId = req.authuser._id;
        wishlist.uuid = uuidv4();

        try{
            let result = await wishlistService.createWishlist(wishlist);
            res.status(201).send({
                success: true,
                message: "Wishlist created successfully.",
                data: result
            });
        }
        catch( err ){

            res.status(400).send({

                success: false,
                message: "Error performing this operation",
                data: err.toString()
            });
        }
    },


    /**
     * Get data for a sinlge instance of a wishlist
     */
    view: async (req, res) => {

        let wishlistId = req.params.wishlistId;

        try {
            let wishlist = await wishlistService.viewWishlist(wishlistId);

            return res.status(200).json({
                success: true,
                message: "Wishlist retrieved successfully.",
                data: wishlist
            });
            
        } catch ( err ) {
            return res.status(400).json({
                success: false,
                message: "Error occured while performing this operation.",
                data: err.toString()
            });
        }
    },


    /**
     * update a single wishlist model
     * 
     */
    update: async (req, res) => {

        let wishlistId = req.params.wishlistId;
        let wishlistData = req.body;

        try {
            
            let resp = await wishlistService.updateWishlist(wishlistId, wishlistData);
            //addHistory( wishlistId, "WISHLIST_UPDATE");

            return res.status(200).json({
                success: true,
                message: "Wishlist information has been updated successfully.",
                data: resp
            });                                                                                                                                                                                                         

        } catch (e) {
            
            return res.status(400).json({
                success: false,
                message: "Error occured while trying to update this wishlist.",
                data: e.toString()
            });
        }
    },


    /**
     * softDeletes a single wishlist instance.
     * @authLevel - authenticated | isWishlistOwner
     */
    softdelete: async (req, res) => { 

        const wishlistId = req.params.wishlistId;
        const userId = req.authuser._id

        try {
            
            let resp = await wishlistService.softDeleteWishlist(wishlistId, userId);
            return res.status(200).json({
                success: true,
                message: "Wishlist information has been deleted successfully.",
                data: resp
            });

        } catch ( err ) {
            
            return res.status(400).json({
                success: false,
                message: "Error occured while trying to update this wishlist.",
                data: err.toString()
            });
        }
    },


    /**
     * adds new invitees to the wishlist invitees
     * 
     */
    addInvites: async ( req, res) => {

        let wishlistId = req.params.wishlistId;
        let invites = req.body.invites;

        if( invites.constructor !== Array ){

            return res.status(400).json({

                success: false,
                message: `Expected body to be an array, ${typeof invites} provided.`
            });
        }
        
        try {
            let response = await wishlistService.addInvitees(wishlistId, invites);

            return res.status(200).json({
                success: true,
                message: "invites have been add successfully. An email has been sent to notify the recepient.",
                data: response
            });
            
        } catch ( err ) {

            return res.status(400).json({

                success: false,
                message: "Error occured while performing this operation.",
                data: err.toString()
            });
        }

    },

    /**
     * removes an invite from the list of invites for a wishlist
     * 
     */
    removeInvites: async ( req, res) => {

        let wishlistId = req.params.wishlistId;
        let invite = req.body.email;
        
        try {
            let result = await wishlistService.removeInvitee(wishlistId, invite);

            return res.status(200).json({
                success: true,
                message: "Invite has been removed successfully.",
                data: result
            });
            
        } catch ( err ) {

            return res.status(400).json({

                success: false,
                message: "Error occured while performing this operation.",
                data: err.toString()
            });
        }

    },

    /**
     * adds new item to the wishlist array of items
     * 
     */
    addItem: async ( req, res) => {

        let wishlistId = req.params.wishlistId;
        let item = req.body.item;
        
        try {
            let response = await wishlistService.addItem(wishlistId, item);

            return res.status(200).json({
                success: true,
                message: "Item has been add successfully.",
                data: response
            });
            
        } catch ( err ) {

            return res.status(400).json({

                success: false,
                message: "Error occured while performing this operation.",
                data: err.toString()
            });
        }

    },


    /**
     * removes an item from the list of itmes for a wishlist
     * 
     */
    removeItem: async ( req, res) => {

        let wishlistId = req.params.wishlistId;
        let itemId = req.body.itemId;
        
        try {
            let result = await wishlistService.removeItem(wishlistId, itemId);

            return res.status(200).json({
                success: true,
                message: "Item has been removed successfully.",
                data: result
            });
            
        } catch ( err ) {

            return res.status(400).json({

                success: false,
                message: "Error occured while performing this operation.",
                data: err.toString()
            });
        }

    },


    /**
     * Adds a pledge to an item
     * this simply means this user has opted to buy this item in the wishlist
     * 
     */
    pledgeItem: async (req, res) => {

        let wishlistId = req.params.wishlistId;
        let itemId = req.body.itemId;
        let pledgeInfo = {};

        pledgeInfo.userId = req.authuser._id;

        try {
            
            let resp = await wishlistService.pledge(wishlistId, itemId, pledgeInfo );
            //addHistory( wishlistId, "WISHLIST_ITEM_PLEDGE");

            return res.status(200).json({
                success: true,
                message: "You have succesfully volunteered to buy this item.",
                data: resp
            });                                                                                                                                                                                                         

        } catch (e) {
            
            return res.status(400).json({
                success: false,
                message: "Error occured while trying to update this wishlist.",
                data: e.toString()
            });
        }
    },


    /**
     * Removes a pledge from the array of pledges for an item
     * This simply means this user has opted out of buying this item in the wishlist
     * 
     */
    unpledgeItem: async ( req, res) => {

        let wishlistId = req.params.wishlistId;
        let itemId = req.body.itemId;
        let userId = req.authuser._id;
        //addHistory( wishlistId, "WISHLIST_ITEM_UNPLEDGE");

        try {
            let result = await wishlistService.unPledge(wishlistId, itemId, userId);

            return res.status(200).json({
                success: true,
                message: "Invite has been removed successfully.",
                data: result
            });
            
        } catch ( err ) {

            return res.status(400).json({

                success: false,
                message: "Error occured while performing this operation.",
                data: err.toString()
            });
        }

    }

    
}
