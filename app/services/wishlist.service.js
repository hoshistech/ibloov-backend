const Wishlist = require('@models/wishlist.model');

module.exports = {

    "model": Wishlist,

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

        return await Wishlist.findByIdAndUpdate( wishlistId, updateData, { runValidators: true, new: true});
       
    },


    /**
     * performs a softDelete operation on a single instance of a  model
     * @param wishlistId integer
     *
     */
    softDeleteWishlist: async (wishlistId) => {

        const updateData = { deletedAt: Date.now(), deletedBy: '5e8cb0191ec1f8160def48c1' };
        return await module.exports.updateWishlist(wishlistId, updateData); 
    },

    /**
     * add new invitees to a wishlist
     * 
     * @param wishlistId String
     * @param contacts array
     */
    addInvitees: async( wishlistId, invites = [] ) => {

        return await Wishlist.findOneAndUpdate(
            { "_id" : wishlistId },
            { 
                "$addToSet": { 
                    invitees : { 
                        "$each": invites
                    } 
                } 
            }, 
            { runValidators: true, new: true }
        );
    },

    /**
     * Removes a contact from the list of invitees for a wishlist
     * 
     * @param wishlistId String
     * @param email String
     */
    removeInvitee: async( wishlistId, email ) => {

        let update = await Wishlist.findByIdAndUpdate( wishlistId, { $pull: { 'invitees':  { "email": email }  } }, 
        { runValidators: true,  new: true} );
        return update;
    },

    /**
     * removes all documents in this colletion
     * This service cannot be exposed to a controller 
     * and should only be used during tests and on the test Db
     * 
     */
    removeAll: async () => {

        let env = process.env.NODE_ENV;

        if( env === 'test'){
            return await Wishlist.deleteMany({}) 
        }
    },


    /**
     * allows a user to pledge to a certain amount on a wishlist
     * if user has pleadged before, it updates the pledge, else, it adds the pledge to the set.
     * @param crowdFundingId integer - id of the crowdFunding model to be updated.
     * @param donation Object - info about the donation and the donor
     * 
     */
    pledge: async ( wishlistId, itemId, pledge ) => {

        return await Wishlist
        .findOneAndUpdate( { _id: wishlistId, "items._id": itemId, "items.userId": {$ne: pledge.userId } }, 
        { $addToSet : { "items.$.pledges" : pledge }}, 
        { runValidators: true, new: true } );
        
    },

    /**
     * allows a user to renege on a pledge to an item in a wishist.
     * @param crowdFundingId integer - the unique id of the crowdfuding model
     * @param userId integer - the unique ID of the user
     */
    unPledge: async(wishlistId, itemId, userId) => {

        let update = await Wishlist.findOneAndUpdate( { _id: wishlistId, "items._id": itemId }, { $pull: { 'items.$.pledges':  { "userId": userId }  } }, 
        { runValidators: true, new: true} );
        return update
    },


    /**
     * Adds an item to a wishlist
     * @param wishlistId String
     * @param item object
     */
    addItem: async (wishlistId, item) => {

        return await Wishlist
        .findOneAndUpdate( { _id: wishlistId }, 
        { $addToSet : { items: item }}, 
        { runValidators: true, new: true } );
    },

    /**
     * Removes an item from a wishlist
     * @param wishlistId String
     * @param itemId String
     */
    removeItem: async (wishlistId, itemId) => {

        let update = await Wishlist.findByIdAndUpdate( wishlistId, { $pull: { 'items':  { "_id": itemId }  } }, 
        { runValidators: true, new: true} );
        return update
        
    }
}