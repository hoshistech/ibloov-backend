const Wishlist = require('@models/wishlist.model');

module.exports = {

    /**
     * returns all wishlists
     * @param query object 
     * @param options object
     */
    all: async ( query = {}, options = {} ) =>{

        //const {limit, sort} =  options;
        query["deletedAt"] = null;
        let wishlist = await Wishlist.find(query);
        return wishlist;
    }
}