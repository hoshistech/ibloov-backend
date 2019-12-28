const service = require('@services/wishlist.service');
const uuidv4 = require('uuid/v4');
const { addHistory } = require('@helpers/event.helper');

/**
 * get wishlists
 */
index = async (req, res) => {

    try{
        let wishlists = await service.all();
        res.status(200).send({

            success: true,
            message: "Wishlist retreived succesfully",
            data: wishlists
        });
    }
    catch(e){

        res.status(400).send({
            success: false,
            message: "error performing this operation",
            data: e.toString()
        });
    }
    
},


/**
 * create a new wishlist
 */
create = async (req, res) => {

    let wishlist = req.body;
    wishlist.createdBy = "76trfguiolk";
    wishlist.uuid = uuidv4();

    try{
        await service.createWishlist(wishlist);
        res.status(200).send({
            success: true,
            message: "Wishlist created successfully.",
            data: wishlist
        });
    }
    catch(e){

        res.status(400).send({
            success: false,
            message: "Error performing this operation",
            data: e.toString()
        });
    }
};


/**
 * Get data for a sinlge instance of a wishlist
 */
view = async (req, res) => {

    let wishlistId = req.params.wishlistId;

    if( ! wishlistId ){

        return res.status(400).json({
            success: false,
            message: "invalid wishlist id provided.",
        });
    }

    try {
        let wishlist = await service.viewWishlist(wishlistId);

        if( ! wishlist){

            return res.status(404).json({
                success: true,
                message: "Wishlist not found!."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Wishlist retrieved successfully.",
            data: wishlist
        });
        
    } catch (e) {
        return res.status(400).json({
            success: false,
            message: "Error occured while performing this operation.",
            data: e.toString()
        });
    }
};


/**
 * update a single wishlist model
 * 
 */
update = async (req, res) => {

    let wishlistId = req.params.wishlistId;
    let wishlistData = req.body;

    console.log("wishlistId is ");
    console.log(wishlistId);

    if( ! wishlistId ){
        return res.status(400).json({
            success: false,
            message: "Required wishlist id missing."
        });
    }

    let wishlist = await service.viewWishlist(wishlistId);

    console.log("wishlist is ");
    console.log(wishlist);
    
    if( ! wishlist ){
        return res.status(404).json({
            success: false,
            message: "invalid wishlist."
        });
    }

    try {
        
        let resp = await service.updateWishlist(wishlistId, wishlistData);
        //addHistory( wishlistId, "WISHLIST_UPDATE");

        console.log("resp is ");
        console.log(resp);

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
};


/**
 * softDeletes a single wishlist instance.
 * @authLevel - authenticated | isWishlistOwner
 */
softdelete = async (req, res) => { 

    let wishlistId = req.params.wishlistId;
    let wishlistData = req.body;

    if( ! wishlistId){
        return res.status(400).json({
            success: false,
            message: "required wishlist id missing."
        });
    }

    

    try {

        let wishlist = await service.viewWishlist(wishlistId);
        if( ! wishlist ){
            return res.status(404).json({
                success: false,
                message: "invalid wishlist."
            });
        }
        
       let resp = await service.softDeleteWishlist(wishlistId, wishlistData);
        return res.status(200).json({
            success: true,
            message: "Wishlist information has been deleted successfully.",
            data: resp
        });

    } catch (e) {
        
        return res.status(400).json({
            success: false,
            message: "Error occured while trying to update this wishlist.",
            data: e.toString()
        });
    }
};



module.exports = {index, create, view, update, softdelete }