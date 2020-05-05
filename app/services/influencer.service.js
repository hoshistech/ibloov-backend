const Influencer = require('@models/influencer.model');
const { setDefaultOptions  } = require('@helpers/request.helper');

module.exports = {

    "model": Influencer,

    /**
     * returns all influencers given certain parameters
     * @param query object 
     * @param options object
     * 
     */
    all: async ( query, options ) =>{

        let sort = {};
        options = options || setDefaultOptions();
        
        const {limit, skip, sortBy, orderBy } = options;
        sort[ sortBy ] = orderBy;
    
        let influencers = await Influencer.find(query)
        .sort(sort)
        .limit(limit)
        .skip(skip)
        .populate('userId', '_id avatar email local.firstName local.lastName')
        .populate('events.eventId', '_id name startDate')
        .populate('followers.userId', '_id avatar email local.firstName local.lastName')
        .populate('wishlists.wishlistId', '_id name')

        return influencers;
    },


    /**
     * creates a new influencer
     * @param influencerData object
     * 
     * @TODO prevent verifiedAt and isVerified to be populated at creation
     */
    createInfluencer: async (influencerData ) =>{

        let influencer = new Influencer(influencerData);
        let result = await influencer.save(); 
        return result; 
    },


    /**
     * returns a single instance of an influencer
     * @param influencerId String
     */
    viewInfluencer: async ( influencerId ) => {

        let influencer = await Influencer.findById(influencerId)
        .populate('userId', '_id avatar email local.firstName local.lastName');
        return influencer;
    },


    /**
     * update a single influencer instance
     * @param influencerId integer
     * @param updateData 
     */
    updateInfluencer: async (influencerId, updateData) => {

        const result = await Influencer.findByIdAndUpdate( influencerId, updateData, {new: true});
        return result;
    },


    /**
     * update a set of a single influencer model
     * @param influencerId String 
     * @param update object
     * 
     */
    updateInfluencerSet: async (influencerId, setData) => {

        return await Influencer.findByIdAndUpdate( { _id: influencerId } , { '$addToSet': setData }, { new: true });
    },


    /**
     * performs a softDelete operation on a single instance of a model
     * @param influencerId integer
     *
     */
    softDeleteInfluencer: async (influencerId) => {

        const updateData = {deletedAt: Date.now(), deletedBy: '1edfhuio3ifj'};
        return await module.exports.updateInfluencer(influencerId, updateData);  
    },


    /**
     * updates an influencer instance -  adds a new audit history to the influencer document
     * @param influencerId String - the unique identifier of the influencer.
     * @param influencer string - the name of the influencer e.g create, delete etc.
     * 
     */
    addInfluencerHistory: async (influencerId, influencer, userId ) => {

        let history  = {
            influencer,
            createdAt: new Date(),
            comment: "new influencer history",
            userId
        };

        let set = { 'history': history };

        return await module.exports.updateInfluencerSet(influencerId, set);
    },



    /**
     * adds a new follower to the followers an influencer
     * 
     * @param influencerId String 
     * @param user Object 
     * 
     * @return 
     */
    followInfluencer: async( influencerId, user ) => {

        let follower = {
            userId: user._id,
            fullName: user.fullName,
            email: user.email,
            createdAt: new Date(),
        };

        let setData = { 'followers': follower };
        return await Influencer.findOneAndUpdate( 
            
            {_id: influencerId}, 
            { $addToSet : setData }, { new: true}
        );
    },

        
    /**
     * check if a user is followiig an influencer
     * 
     * @param influencerId string
     * @param userId string
     * 
     * @return boolean
     */
    isFollowingInfluencer: async (influencerId, userId) => {

        let influencer = await Influencer.findOne({ _id: influencerId, 'followers.userId': userId });
        return influencer ? true : false;
    },


    /**
     * unsubsribes a user from an influencer
     * the user no longer gets notifications of happenings from that influencer. 
     * @param influencerId string
     * @param userId string
     */
    unfollowInfluencer: async (influencerId, userId) => {

        return await Influencer.findByIdAndUpdate( influencerId, { $pull: { 'followers':  {"userId": userId }  } }, 
        { new: true} );
       
    },


    /**
     * disables a users from getting notifications about an influencer
     * even if the user is following the influencer
     * 
     * @param influencerId String
     * @param userId String
     */
    muteInfluencerNotification: async ( influencerId, userId ) => {

        return await Influencer.findOneAndUpdate( { _id: influencerId, "followers.userId": userId }, { $set : { 'followers.$.allowNoifications' : false }}, { runValidators: true } );  
    },


    /**
     * Verify an influencer 
     * @param influencerId String
     * 
     * @TODO - add 'verifiedBy' to the schema and the update object
     */
    verifyInfluencer: async (influencerId) => {

        let verificationUpdate = {
            isVerified: true,
            verifiedDate: new Date
        }

        return await module.exports.updateInfluencer( influencerId, verificationUpdate); 
        
    },


    isLegible: async ( influencerId ) => {

        //influencer must have at least x number of followers
        //must have been on the platform for x period
        //followers must be organic 
        
    }
}