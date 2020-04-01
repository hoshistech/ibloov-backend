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

    /**
     * add new invitees to a wishlist
     * 
     * @param wishlistId String
     * @param contacts array
     */
    addInvitees: async( wishlistId, invites = [] ) => {

        try{

            await Wishlist.bulkWrite(

                invites.map( contact => 
                  ({
                    updateOne: {
                      filter: { '_id': wishlistId, 'invitees.email' : { $ne: contact.email } },
                      update: { $push: { invitees: contact } }
                    }
                  })
                )
            )
        } catch(err) {
            throw err;
        }
    },

    /**
     * Removes a contact from the list of invitees for a wishlist
     * 
     * @param wishlistId String
     * @param email String
     */
    removeInvitee: async( wishlistId, email ) => {

        let update = await Wishlist.findByIdAndUpdate( wishlistId, { $pull: { 'invitees':  { "email": email }  } }, 
        { new: true} );
        return update;
    }
}