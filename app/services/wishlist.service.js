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
    },

    /**
     * creates a single wishlist instance
     * @param wishlistData object
     * 
     */
    createWishlist: async (wishlistData) => {

        let wishlist = new Wishlist(wishlistData);
        let result = await wishlist.save(); 
        return result;
    },


    /**
     * returns a single instance of a wishlist
     * @param wishlistId String
     */
    viewWishlist: async (wishlistId) => {

        let wishlist = await Wishlist.findById(wishlistId);
        return wishlist;
    },


    /**
     * update a single wishlist instance
     * @param wishlistId integer
     * @param updateData object
     * 
     */
    updateWishlist: async (wishlistId, updateData) => {

        const result = await Wishlist.findByIdAndUpdate( wishlistId, updateData, {new: true});
        return result;
    },


    /**
     * performs a softDelete operation on a single instance of a  model
     * @param wishlistId integer
     *
     */
    softDeleteWishlist: async (wishlistId) => {

        console.log(wishlistId);
        const updateData = { deletedAt: Date.now(), deletedBy: '1edfhuio3ifj' };
        return await module.exports.updateWishlist(wishlistId, updateData); 
    },
}