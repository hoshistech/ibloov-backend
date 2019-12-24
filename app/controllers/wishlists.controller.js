const service = require('@services/wishlist.service');


/**
 * get events
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



module.exports = {index }